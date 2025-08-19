const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

// Note: this router is mounted at '/api/reviews' in server.js
// Therefore child paths here should be relative to that base, e.g. '/'
router.post('/', reviewController.createReview);
router.get('/', reviewController.getReviews);
// Avis donnés par l'utilisateur connecté
router.get('/user/my-reviews', authMiddleware, reviewController.getMyReviews);
router.get('/:id', reviewController.getReviewById);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
