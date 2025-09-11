// src/controllers/reservationController.js
const Reservation = require('../models/reservation');
const Boat = require('../models/boat');
const Review = require('../models/review');

// Obtenir les réservations pour un bateau donné
exports.getReservationsByBoat = async (req, res) => {
  try {
    const reservations = await Reservation.find({ boat: req.params.boatId }).populate('boat user');
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer une réservation
exports.createReservation = async (req, res) => {
  try {
    const { boatId, startDate, endDate, price, onBehalfOfUserId, guestName, guestEmail } = req.body;
    const requesterId = req.user.id;

    // Vérifier la disponibilité du bateau
    const boat = await Boat.findById(boatId);
    if (!boat) {
      return res.status(404).json({ message: 'Bateau non trouvé' });
    }

    // Autorisation minimale: tout utilisateur authentifié peut réserver.
    // Si c'est un propriétaire qui réserve "au nom de" quelqu'un, il doit être propriétaire du bateau.
    if (req.user.role === 'owner' && String(boat.owner) !== String(requesterId) && onBehalfOfUserId) {
      return res.status(403).json({ message: 'Seul le propriétaire du bateau peut réserver au nom d\'un client pour ce bateau' });
    }

    // Vérifier les dates
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s) || isNaN(e) || s >= e) {
      return res.status(400).json({ message: 'La date de fin doit être après la date de début' });
    }

    // 1) Conflit avec d'autres réservations CONFIRMÉES (logique stricte; adjacent autorisé)
    const overlapReservation = await Reservation.findOne({
      boat: boatId,
      status: 'confirmed',
      $expr: {
        $and: [
          { $lt: ['$startDate', e] },
          { $gt: ['$endDate', s] }
        ]
      }
    });
    if (overlapReservation) {
      return res.status(409).json({ message: 'Chevauchement avec une autre réservation confirmée' });
    }

    // 2) Conflit avec des périodes bloquées (logique stricte; adjacent autorisé)
    const BlockedDate = require('../models/blockedDate');
    const overlappingBlock = await BlockedDate.findOne({
      boat: boatId,
      $expr: {
        $and: [
          { $lt: ['$startDate', e] },
          { $gt: ['$endDate', s] }
        ]
      }
    });
    if (overlappingBlock) {
      return res.status(409).json({ message: 'Ces dates sont bloquées par le propriétaire' });
    }

    // Créer la réservation
    let reservationUser = requesterId;
    const meta = {};
    if (req.user.role === 'owner') {
      meta.createdByOwner = true;
      meta.createdBy = requesterId;
      if (onBehalfOfUserId) {
        reservationUser = onBehalfOfUserId;
      }
      if (guestName) meta.guestName = guestName;
      if (guestEmail) meta.guestEmail = guestEmail;
    }

    // Calcul serveur du prix pour cohérence
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const days = Math.max(1, Math.floor((e - s) / MS_PER_DAY));
    const daily = Number(boat.dailyPrice) || 0;
    const computedPrice = daily * days;

    const reservation = new Reservation({
      boat: boatId,
      user: reservationUser,
      startDate: s,
      endDate: e,
      price: computedPrice || price,
      ...meta
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
    if (!boat || (boat.owner.toString() !== req.user.id && req.user.role !== 'admin')) {
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
    const { id } = req.params;
    const existing = await Reservation.findById(id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    // Autorisation: propriétaire du bateau ou admin
    const boat = await Boat.findById(existing.boat);
    if (!boat || (boat.owner.toString() !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const payload = { ...req.body };
    const startDate = payload.startDate ? new Date(payload.startDate) : new Date(existing.startDate);
    const endDate = payload.endDate ? new Date(payload.endDate) : new Date(existing.endDate);
    if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
      return res.status(400).json({ message: 'Plage de dates invalide' });
    }

    // Vérifier chevauchement avec autres réservations du même bateau (exclude current, except cancelled)
    const overlapReservation = await Reservation.findOne({
      _id: { $ne: id },
      boat: existing.boat,
      status: { $ne: 'cancelled' },
      $expr: {
        $and: [
          // Utiliser des comparaisons strictes pour autoriser les plages adjacentes (pas de conflit si ev.end === start ou ev.start === end)
          { $lt: ['$startDate', endDate] },
          { $gt: ['$endDate', startDate] }
        ]
      }
    });
    if (overlapReservation) {
      return res.status(409).json({ message: 'Chevauchement avec une autre réservation' });
    }

    // Vérifier chevauchement avec blocages (même logique stricte)
    const BlockedDate = require('../models/blockedDate');
    const overlapBlock = await BlockedDate.findOne({
      boat: existing.boat,
      $expr: {
        $and: [
          { $lt: ['$startDate', endDate] },
          { $gt: ['$endDate', startDate] }
        ]
      }
    });
    if (overlapBlock) {
      return res.status(409).json({ message: 'Chevauchement avec une période bloquée' });
    }

    existing.startDate = startDate;
    existing.endDate = endDate;
    if (payload.status) existing.status = payload.status;
    // Recalculate price based on boat.dailyPrice and number of days
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const days = Math.max(1, Math.floor((endDate - startDate) / MS_PER_DAY));
    const daily = Number(boat.dailyPrice) || 0;
    existing.price = daily * days;
    await existing.save();
    res.json(existing);
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
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).populate('boat user');
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
