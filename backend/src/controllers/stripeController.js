const Stripe = require('stripe');
const Reservation = require('../models/reservation');
const Payment = require('../models/payment');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// Create a Checkout Session for a reservation/boat payment
// Expects: { amount, currency, description, metadata }
exports.createCheckoutSession = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('[Stripe] STRIPE_SECRET_KEY manquante');
      return res.status(500).json({ message: 'Configuration Stripe manquante (clé secrète)' });
    }
    if (!process.env.FRONTEND_URL) {
      console.warn('[Stripe] FRONTEND_URL manquante - utilisation de http://localhost:5173 par défaut');
    }
    const { amount, currency = 'eur', description = 'Paiement', metadata = {} } = req.body || {};

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Montant invalide' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: description },
            unit_amount: Math.round(amount), // amount in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel`,
      metadata,
      // Propager les métadonnées vers le PaymentIntent pour les événements payment_intent.*
      payment_intent_data: {
        metadata,
      },
    });

    return res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe createCheckoutSession error:', err?.message || err);
    return res.status(500).json({ message: `Erreur de création de session de paiement` });
  }
};

// Create a Checkout Session for a Reservation by ID
// Route: POST /api/stripe/reservations/:id/checkout
exports.createReservationCheckoutSession = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('[Stripe] STRIPE_SECRET_KEY manquante');
      return res.status(500).json({ message: 'Configuration Stripe manquante (clé secrète)' });
    }
    if (!process.env.FRONTEND_URL) {
      console.warn('[Stripe] FRONTEND_URL manquante - utilisation de http://localhost:5173 par défaut');
    }
    const { id } = req.params;
    const reservation = await Reservation.findById(id).populate('boat user');
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation introuvable' });
    }

    // Convert price (assumed EUR) to cents
    const amountCents = Math.round(Number(reservation.price) * 100);
    if (!amountCents || amountCents <= 0) {
      return res.status(400).json({ message: 'Montant de réservation invalide' });
    }

    const description = `Réservation bateau ${reservation.boat?._id || ''} du ${new Date(reservation.startDate).toLocaleDateString()} au ${new Date(reservation.endDate).toLocaleDateString()}`.trim();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: description || 'Réservation bateau' },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel`,
      metadata: {
        reservationId: reservation._id.toString(),
        userId: reservation.user?._id?.toString() || '',
        boatId: reservation.boat?._id?.toString() || '',
      },
      // Propager les métadonnées vers le PaymentIntent pour récupérer reservationId dans payment_intent.succeeded
      payment_intent_data: {
        metadata: {
          reservationId: reservation._id.toString(),
          userId: reservation.user?._id?.toString() || '',
          boatId: reservation.boat?._id?.toString() || '',
        },
      },
    });

    return res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe createReservationCheckoutSession error:', err?.type || err?.code || err?.message || err);
    return res.status(500).json({ message: 'Erreur de création de session de paiement (Stripe)' });
  }
};

// Confirm payment manually using session_id (alternative to webhook)
exports.confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ message: 'session_id requis' });

    // 1) Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Paiement non confirmé' });
    }

    // 2) Retrouver reservationId de manière robuste
    let reservationId = session.metadata?.reservationId;
    if (!reservationId && session.payment_intent) {
      try {
        const intent = await stripe.paymentIntents.retrieve(session.payment_intent);
        reservationId = intent?.metadata?.reservationId || reservationId;
      } catch (_) {}
    }
    if (!reservationId) {
      // Fallback: essayer de retrouver une réservation avec ce paymentSessionId
      const existing = await Reservation.findOne({ paymentSessionId: session.id }).select('_id');
      if (existing?._id) reservationId = existing._id.toString();
    }
    if (!reservationId) {
      return res.status(400).json({ message: 'Aucune réservation associée' });
    }

    // 3) Idempotence: si déjà paid, répondre 200
    const current = await Reservation.findById(reservationId);
    if (!current) return res.status(404).json({ message: 'Réservation non trouvée' });
    if (current.paymentStatus === 'paid') {
      return res.json({
        message: 'Paiement déjà confirmé (idempotent) : réservation en attente de validation du propriétaire',
        reservation: current,
        session_id: session.id,
      });
    }

    // 4) Mettre à jour uniquement le paiement (laisser status = pending)
    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      {
        $set: {
          paymentStatus: 'paid',
          paymentSessionId: session.id,
          paymentIntentId: session.payment_intent || '',
        },
      },
      { new: true }
    );
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });

    // 5) Créer un enregistrement Payment (best effort)
    let payment = null;
    try {
      payment = await Payment.create({
        reservation: reservationId,
        amount: typeof session.amount_total === 'number' ? session.amount_total / 100 : 0,
        method: 'carte',
        status: 'effectué',
        paymentDate: new Date(),
      });
    } catch (_) {}

    res.json({
      message: 'Paiement confirmé: réservation en attente de validation du propriétaire',
      reservation,
      payment,
      session_id: session.id,
    });
  } catch (error) {
    console.error('Erreur confirmation paiement:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Stripe Webhook handler (must use express.raw on the route)
exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        // Mark reservation as paid if metadata contains reservationId
        const { reservationId } = session.metadata || {};
        if (reservationId) {
          try {
            await Reservation.findByIdAndUpdate(
              reservationId,
              {
                $set: {
                  paymentStatus: 'paid',
                  paymentSessionId: session.id,
                  paymentIntentId: session.payment_intent || '',
                },
              },
              { new: true }
            );
            // Create a Payment record for bookkeeping
            try {
              await Payment.create({
                reservation: reservationId,
                amount: typeof session.amount_total === 'number' ? session.amount_total / 100 : 0,
                method: 'carte',
                status: 'effectué',
                paymentDate: new Date(),
              });
            } catch (pErr) {
              console.error('Failed to create Payment record:', pErr);
            }
          } catch (dbErr) {
            console.error('Failed to update reservation as paid:', dbErr);
          }
        }
        console.log('Checkout completed:', session.id);
        break;
      }
      case 'payment_intent.succeeded':
        // Gestion via PaymentIntent (cas où l'event checkout.session.completed n'est pas reçu)
        try {
          const intent = event.data.object;
          let reservationId = intent.metadata?.reservationId;

          // Fallback: si pas de reservationId dans le PaymentIntent, tenter de récupérer la Checkout Session liée
          if (!reservationId) {
            try {
              const sessions = await stripe.checkout.sessions.list({ payment_intent: intent.id, limit: 1 });
              const linkedSession = sessions?.data?.[0];
              if (linkedSession?.metadata?.reservationId) {
                reservationId = linkedSession.metadata.reservationId;
                console.log('Recovered reservationId from Checkout Session:', reservationId);
              } else {
                console.warn('No reservationId found on linked Checkout Session for intent:', intent.id);
              }
            } catch (lsErr) {
              console.error('Failed to list Checkout Sessions for intent:', intent.id, lsErr);
            }
          }
          if (reservationId) {
            try {
              await Reservation.findByIdAndUpdate(
                reservationId,
                {
                  $set: {
                    paymentStatus: 'paid',
                    paymentIntentId: intent.id,
                  },
                },
                { new: true }
              );

              // Créer un enregistrement de paiement
              try {
                await Payment.create({
                  reservation: reservationId,
                  amount: typeof intent.amount_received === 'number' ? intent.amount_received / 100 : (typeof intent.amount === 'number' ? intent.amount / 100 : 0),
                  method: 'carte',
                  status: 'effectué',
                  paymentDate: new Date(),
                });
              } catch (pErr) {
                console.error('Failed to create Payment from intent:', pErr);
              }
            } catch (dbErr) {
              console.error('Failed to update reservation from intent:', dbErr);
            }
          } else {
            console.warn('PaymentIntent without reservationId metadata:', intent.id);
          }
          console.log('PaymentIntent succeeded:', intent.id);
        } catch (e) {
          console.error('Error handling payment_intent.succeeded:', e);
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
  } catch (e) {
    console.error('Webhook handling error:', e);
    res.status(500).send('Server error');
  }
};
