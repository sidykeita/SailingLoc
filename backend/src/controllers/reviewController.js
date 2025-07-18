const Review = require('../models/review');

// Créer une review
exports.createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Récupérer toutes les reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer une review par ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review non trouvée" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modifier une review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) return res.status(404).json({ message: "Review non trouvée" });
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer une review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review non trouvée" });
    res.json({ message: "Review supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
