// backend/src/controllers/favoriteController.js
let User;
if (process.env.NODE_ENV === 'test') {
  // Simple in-memory user favorites store keyed by userId
  const favoritesByUser = new Map();
  const ensureUser = (id) => {
    if (!favoritesByUser.has(id)) favoritesByUser.set(id, []);
    return favoritesByUser.get(id);
  };
  User = {
    findById: (id) => ({
      _id: id,
      id,
      populate: () => ({ favorites: [...ensureUser(id)] })
    }),
    findByIdAndUpdate: (_id, update) => {
      const list = ensureUser(_id);
      if (update?.$addToSet?.favorites) {
        const bid = update.$addToSet.favorites;
        if (!list.includes(bid)) list.push(bid);
      }
      if (update?.$pull?.favorites) {
        const bid = update.$pull.favorites;
        const idx = list.indexOf(bid);
        if (idx >= 0) list.splice(idx, 1);
      }
      return {
        populate: () => ({ favorites: [...list] })
      };
    }
  };
} else {
  User = require('../models/user');
}

exports.getFavorites = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'test') {
      // eslint-disable-next-line no-console
      console.log('[Favorites] GET hit, user:', req.user?.id || req.user?._id);
    }
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'test') {
      console.log('[Favorites] POST add hit, user:', req.user?.id || req.user?._id, 'boatId:', req.params.boatId);
    }
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
    if (process.env.NODE_ENV === 'test') {
      console.log('[Favorites] DELETE remove hit, user:', req.user?.id || req.user?._id, 'boatId:', req.params.boatId);
    }
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
