const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Note: this router is mounted at '/api/reviews' in server.js
// Therefore child paths here should be relative to that base, e.g. '/'
router.post('/', reviewController.createReview);
router.get('/', reviewController.getReviews);
router.get('/:id', reviewController.getReviewById);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
