// src/routes/blockedDate.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController');
const controller = require('../controllers/blockedDate.controller');

// Liste des blocages pour un bateau (owner/admin)
router.get('/boat/:boatId', protect, controller.listByBoat);

// Liste publique (dates uniquement) pour un bateau
router.get('/public/boat/:boatId', controller.listByBoatPublic);

// Créer un blocage (owner/admin)
router.post('/', protect, controller.create);

// Supprimer un blocage (owner/admin, respect locked)
router.delete('/:id', protect, controller.remove);

module.exports = router;
