// src/controllers/blockedDate.controller.js
const BlockedDate = require('../models/blockedDate');
const Reservation = require('../models/reservation');
const Boat = require('../models/boat');

// Helpers
function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart <= bEnd && bStart <= aEnd;
}

// GET /api/blocks/boat/:boatId
exports.listByBoat = async (req, res) => {
  try {
    const { boatId } = req.params;
    // Security: ensure requester is owner of the boat or admin
    const boat = await Boat.findById(boatId);
    if (!boat) return res.status(404).json({ message: 'Bateau non trouvé' });
    if (boat.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const blocks = await BlockedDate.find({ boat: boatId }).sort({ startDate: 1 });
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/blocks
// Body: { boatId, startDate, endDate, reason, notes, locked }
exports.create = async (req, res) => {
  try {
    const { boatId, startDate, endDate, reason, notes, locked } = req.body || {};
    if (!boatId || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'boatId, startDate, endDate et reason sont requis' });
    }
    const boat = await Boat.findById(boatId);
    if (!boat) return res.status(404).json({ message: 'Bateau non trouvé' });
    if (boat.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s) || isNaN(e) || s >= e) {
      return res.status(400).json({ message: 'Plage de dates invalide' });
    }

    // Check conflicts with existing reservations (except cancelled)
    const conflictingReservations = await Reservation.find({
      boat: boatId,
      status: { $ne: 'cancelled' },
      $expr: {
        $and: [
          { $lte: ['$startDate', e] },
          { $gte: ['$endDate', s] }
        ]
      }
    }).limit(1);
    if (conflictingReservations.length > 0) {
      return res.status(409).json({ message: 'Conflit avec une réservation existante' });
    }

    // Check conflicts with existing blocks (prevent overlaps to keep clarity)
    const conflictingBlocks = await BlockedDate.find({
      boat: boatId,
      $expr: {
        $and: [
          { $lte: ['$startDate', e] },
          { $gte: ['$endDate', s] }
        ]
      }
    }).limit(1);
    if (conflictingBlocks.length > 0) {
      return res.status(409).json({ message: 'Chevauchement avec un blocage existant' });
    }

    const block = await BlockedDate.create({
      boat: boatId,
      owner: boat.owner,
      startDate: s,
      endDate: e,
      reason,
      notes,
      locked: !!locked
    });
    res.status(201).json(block);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/blocks/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const block = await BlockedDate.findById(id);
    if (!block) return res.status(404).json({ message: 'Blocage non trouvé' });

    const boat = await Boat.findById(block.boat);
    if (!boat) return res.status(404).json({ message: 'Bateau non trouvé' });
    if (boat.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    if (block.locked && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Ce blocage est verrouillé' });
    }

    await block.deleteOne();
    res.json({ message: 'Blocage supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
