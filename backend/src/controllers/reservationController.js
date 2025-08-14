// src/controllers/reservationController.js
const Reservation = require('../models/reservation');
const Boat = require('../models/boat');
const Review = require('../models/review');

// Créer une réservation
exports.createReservation = async (req, res) => {
  try {
    const { boatId, startDate, endDate, price } = req.body;
    const user = req.user.id;

    // Vérifier la disponibilité du bateau
    const boat = await Boat.findById(boatId);
    if (!boat) {
      return res.status(404).json({ message: 'Bateau non trouvé' });
    }

    // Vérifier les dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'La date de fin doit être après la date de début' });
    }

    // Créer la réservation
    const reservation = new Reservation({
      boat: boatId,
      user,
      startDate,
      endDate,
      price // <-- Ajout du champ price
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

// Mettre à jour le statut d'une réservation
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Vérifier si l'utilisateur est le propriétaire du bateau
    const boat = await Boat.findById(reservation.boat);
    if (!boat || boat.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    reservation.status = status;
    await reservation.save();
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

// Annuler une réservation
exports.cancelReservation = async (req, res) => {
  try {
    const { reason } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Vérifier si l'utilisateur est le locataire
    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    reservation.status = 'cancelled';
    reservation.cancellationReason = reason;
    await reservation.save();
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

// Obtenir les réservations du locataire connecté
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).populate('boat user');
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir les réservations des bateaux d'un propriétaire
exports.getOwnerReservations = async (req, res) => {
  try {
    const boats = await Boat.find({ owner: req.user.id });
    const boatIds = boats.map(boat => boat._id);
    const reservations = await Reservation.find({ boat: { $in: boatIds }, status: { $ne: 'cancelled' } })
      .populate('boat')
      .populate('user');
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajouter un avis à une réservation
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Vérifier si l'utilisateur est le locataire
    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Vérifier si la réservation est terminée
    if (new Date(reservation.endDate) > new Date()) {
      return res.status(400).json({ message: 'La réservation n\'est pas encore terminée' });
    }

    // Créer l'avis
    const review = new Review({
      reservation: reservation._id,
      user: req.user.id,
      boat: reservation.boat,
      rating,
      comment
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
