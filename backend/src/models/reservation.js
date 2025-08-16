// src/models/reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  boat: { type: mongoose.Schema.Types.ObjectId, ref: 'Boat', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  price: { type: Number, required: true }
}, { timestamps: true });

// Index pour accélérer la recherche d'overlaps lors du calcul de disponibilité
reservationSchema.index({ boat: 1, startDate: 1, endDate: 1, status: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
