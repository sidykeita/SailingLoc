// backend/src/routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { protect } = require('../controllers/authController');

router.get('/', protect, favoriteController.getFavorites);
router.post('/:boatId', protect, favoriteController.addFavorite);
router.delete('/:boatId', protect, favoriteController.removeFavorite);

module.exports = router;
