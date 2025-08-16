const Boat = require('../models/boat');
const Reservation = require('../models/reservation');

// Créer un bateau
exports.createBoat = async (req, res) => {
  try {
    // DEBUG : log req.user pour comprendre le contexte d'auth
    console.log('DEBUG req.user:', req.user);
    // Injection automatique de l'owner à partir du token utilisateur
    const boatData = { ...req.body, owner: req.user && req.user._id };
    const boat = await Boat.create(boatData);
    res.status(201).json(boat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obtenir tous les bateaux
exports.getBoats = async (req, res) => {
  try {
   const filters = {};

    if (req.query.name) {
      filters.name = { $regex: req.query.name, $options: 'i' }; // recherche partielle insensible à la casse
    }
    if (req.query.type) {
      filters.type = req.query.type;
    }
    if (req.query.length_min || req.query.length_max) {
      filters.length = {};
      if (req.query.length_min) filters.length.$gte = Number(req.query.length_min);
      if (req.query.length_max) filters.length.$lte = Number(req.query.length_max);
    }
    if (req.query.capacity) {
      filters.capacity = Number(req.query.capacity);
    }
    if (req.query.cabins) {
      filters.cabins = Number(req.query.cabins);
    }
    if (req.query.licenseRequired) {
      if (req.query.licenseRequired === 'true' || req.query.licenseRequired === 'false') {
        filters.licenseRequired = req.query.licenseRequired === 'true';
      }
    }
    if (req.query.dailyPrice_min || req.query.dailyPrice_max) {
      filters.dailyPrice = {};
      if (req.query.dailyPrice_min) filters.dailyPrice.$gte = Number(req.query.dailyPrice_min);
      if (req.query.dailyPrice_max) filters.dailyPrice.$lte = Number(req.query.dailyPrice_max);
    }
    if (req.query.owner) {
      filters.owner = req.query.owner; // ici tu filtres par ID du propriétaire
    }

    // Optionnel : pour debug
    console.log("Filters used:", filters);

    const boats = await Boat.find(filters).populate('owner', 'firstName lastName');
    res.json(boats);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir les bateaux disponibles sur une période
exports.getAvailableBoats = async (req, res) => {
  try {
    const { start, end, port, type, capacity, name } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: "Paramètres 'start' et 'end' requis (YYYY-MM-DD)" });
    }

    const startDate = new Date(`${start}T00:00:00.000Z`);
    const endDate = new Date(`${end}T23:59:59.999Z`);
    if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) {
      return res.status(400).json({ message: 'Période invalide' });
    }

    // Filtres bateaux optionnels
    const boatFilters = {};
    if (name) boatFilters.name = { $regex: name, $options: 'i' };
    if (type) boatFilters.type = type;
    if (capacity) boatFilters.capacity = Number(capacity);
    if (port) boatFilters.port = { $regex: port, $options: 'i' };
    // Ex: n'afficher que les bateaux louables
    // boatFilters.status = 'disponible';

    // Réservations qui se chevauchent avec la période demandée
    // Overlap si: startDate <= end ET endDate >= start
    const overlapping = await Reservation.find({
      status: { $in: ['pending', 'confirmed'] },
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    }).select('boat');

    const excluded = new Set(overlapping.map(r => String(r.boat)));

    const boats = await Boat.find(boatFilters).populate('owner', 'firstName lastName');
    const available = boats.filter(b => !excluded.has(String(b._id)));

    res.json(available);
  } catch (err) {
    console.error('getAvailableBoats error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Obtenir les bateaux d'un propriétaire
exports.getUserBoats = async (req, res) => {
  try {
    const boats = await Boat.find({ owner: req.user.id });
    res.status(200).json(boats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir un bateau par ID
exports.getBoatById = async (req, res) => {
  try {
    const boat = await Boat.findById(req.params.id);
    if (!boat) {
      return res.status(404).json({ message: 'Bateau non trouvé' });
    }
    res.json(boat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mettre à jour un bateau
exports.updateBoat = async (req, res) => {
  try {
    const boat = await Boat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!boat) return res.status(404).json({ message: "Bateau non trouvé" });
    res.json(boat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un bateau
exports.deleteBoat = async (req, res) => {
  try {
    const boat = await Boat.findByIdAndDelete(req.params.id);
    if (!boat) return res.status(404).json({ message: "Bateau non trouvé" });
    res.json({ message: "Bateau supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
