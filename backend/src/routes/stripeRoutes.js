const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

// Create Checkout Session
router.post('/create-checkout-session', stripeController.createCheckoutSession);

// Create Checkout Session for a reservation
router.post('/reservations/:id/checkout', stripeController.createReservationCheckoutSession);

// Confirm payment manually (alternative to webhook)
router.post('/confirm', stripeController.confirmPayment);

module.exports = router;
