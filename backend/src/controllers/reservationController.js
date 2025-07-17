// src/controllers/reservationController.js
const Reservation = require('../models/reservation');

// Créer une réservation
exports.createReservation = async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lister toutes les réservations
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('boat user');
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer une réservation par ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('boat user');
    if (!reservation) return res.status(404).json({ error: 'Not found' });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier une réservation
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!reservation) return res.status(404).json({ error: 'Not found' });
    res.json(reservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
