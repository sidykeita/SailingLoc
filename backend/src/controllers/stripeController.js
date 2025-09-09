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
    });

    return res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe createReservationCheckoutSession error:', err?.type || err?.code || err?.message || err);
    return res.status(500).json({ message: 'Erreur de création de session de paiement (Stripe)' });
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
                status: 'confirmed',
                paymentStatus: 'paid',
                paymentSessionId: session.id,
                paymentIntentId: session.payment_intent || '',
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
        // Optional: handle intents directly if needed
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
