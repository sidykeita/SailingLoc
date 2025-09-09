const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// When mounted at /api/payments, these resolve to:
// POST   /api/payments
// GET    /api/payments
// GET    /api/payments/:id
// PUT    /api/payments/:id
// DELETE /api/payments/:id
router.post('/', paymentController.createPayment);
router.get('/', paymentController.getPayments);
router.get('/:id', paymentController.getPaymentById);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
