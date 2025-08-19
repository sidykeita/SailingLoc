const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Un utilisateur ne peut laisser qu'un seul avis par réservation
reviewSchema.index({ reservation: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
