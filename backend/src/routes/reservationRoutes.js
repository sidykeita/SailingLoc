// src/routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.post('/', reservationController.createReservation);
router.get('/', reservationController.getReservations);
router.get('/user', reservationController.getUserReservations);
router.get('/owner', reservationController.getOwnerReservations);
router.get('/:id', reservationController.getReservationById);
router.put('/:id/status', reservationController.updateReservationStatus);
router.put('/:id/cancel', reservationController.cancelReservation);
router.post('/:id/review', reservationController.addReview);
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;
