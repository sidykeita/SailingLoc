const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  boatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Boat', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
