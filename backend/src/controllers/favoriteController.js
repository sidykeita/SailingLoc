// backend/src/controllers/favoriteController.js
const User = require('../models/user');

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { favorites: req.params.boatId } },
      { new: true }
    ).populate('favorites');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { favorites: req.params.boatId } },
      { new: true }
    ).populate('favorites');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
