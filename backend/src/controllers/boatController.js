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
    const boats = await Boat.find();
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
