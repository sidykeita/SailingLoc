// src/models/reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  boat: { type: mongoose.Schema.Types.ObjectId, ref: 'Boat', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  price: { type: Number, required: true },
  // Stripe payment fields
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  paymentSessionId: { type: String },
  paymentIntentId: { type: String },
  currency: { type: String, default: 'eur' },
  // Optional metadata when a reservation is created by an owner on behalf of a guest
  createdByOwner: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestName: { type: String },
  guestEmail: { type: String }
}, { timestamps: true });

// Index pour accélérer la recherche d'overlaps lors du calcul de disponibilité
reservationSchema.index({ boat: 1, startDate: 1, endDate: 1, status: 1 });

// Unicité logique: éviter doublon exact (boat,user,startDate,endDate) pour réservations non annulées
reservationSchema.index(
  { boat: 1, user: 1, startDate: 1, endDate: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'cancelled' } } }
);

module.exports = mongoose.model('Reservation', reservationSchema);
