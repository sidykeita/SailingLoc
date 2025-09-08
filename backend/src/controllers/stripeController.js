const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// Create a Checkout Session for a reservation/boat payment
// Expects: { amount, currency, description, metadata }
exports.createCheckoutSession = async (req, res) => {
  try {
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
    console.error('Stripe createCheckoutSession error:', err);
    return res.status(500).json({ message: 'Erreur de création de session de paiement' });
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
        // TODO: mark reservation/payment as paid in DB using session.metadata
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
