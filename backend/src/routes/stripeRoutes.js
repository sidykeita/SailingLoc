const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

// Create Checkout Session
router.post('/create-checkout-session', stripeController.createCheckoutSession);

module.exports = router;
