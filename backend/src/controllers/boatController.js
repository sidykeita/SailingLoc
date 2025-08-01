const Boat = require('../models/boat');

// Créer un bateau
exports.createBoat = async (req, res) => {
  try {
    const boat = await Boat.create(req.body);
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

    const boats = await Boat.find(filters);
    res.json(boats);

  res.json(boats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir un bateau par ID
exports.getBoatById = async (req, res) => {
  try {
    const boat = await Boat.findById(req.params.id);
    if (!boat) return res.status(404).json({ message: "Bateau non trouvé" });
    res.json(boat);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
