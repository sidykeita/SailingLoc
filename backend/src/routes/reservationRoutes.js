// src/routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { protect } = require('../controllers/authController');

// Création d'une réservation (utilise req.user.id)
router.post('/', protect, reservationController.createReservation);

// Liste globale (peut rester publique)
router.get('/', reservationController.getReservations);

// Réservations du locataire connecté
router.get('/user', protect, reservationController.getUserReservations);

// Réservations des bateaux du propriétaire connecté
router.get('/owner', protect, reservationController.getOwnerReservations);

// Réservations pour un bateau donné
router.get('/boat/:boatId', reservationController.getReservationsByBoat);

// Détails (public ou protégé selon besoin)
router.get('/:id', reservationController.getReservationById);

// Mise à jour statut
router.put('/:id/status', protect, reservationController.updateReservationStatus);

// Mise à jour complète d'une réservation (admin/global)
router.put('/:id', protect, reservationController.updateReservation);

// Annulation par le locataire
router.put('/:id/cancel', protect, reservationController.cancelReservation);

// Avis par le locataire
router.post('/:id/review', protect, reservationController.addReview);

// Suppression
router.delete('/:id', protect, reservationController.deleteReservation);

module.exports = router;
