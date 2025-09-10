const User = require('../models/user');
const Boat = require('../models/boat');
const Reservation = require('../models/reservation');
const Payment = require('../models/payment');

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


  exports.createUser = async (req, res) => {
    console.log("DATA REÇUE PAR LE SERVEUR :", req.body);
      try {
        const {firstName, lastName,email,password, phone, role, createdAt} = req.body;
        const user = new User({ firstName, lastName,email,password, phone, role, createdAt });
        await user.save();
        res.status(201).json(user);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };

// GET one user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/users/:id — met à jour uniquement email et téléphone
exports.updateProfile = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const updates = {};
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true, select: '-password' }
    );
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE user by ID
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) delete updates.password; // sécurité, pas de modif du mdp ici

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé !" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/users/me — suppression sécurisée du compte courant (soft delete)
// Body attendu: { currentPassword: string }
exports.deleteMe = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Non authentifié' });

    const { currentPassword } = req.body || {};
    if (!currentPassword) {
      return res.status(400).json({ message: 'Mot de passe requis pour supprimer le compte' });
    }

    // Charger l'utilisateur avec le mot de passe pour vérification
    const user = await User.findById(userId).select('+password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Bloquer si déjà supprimé
    if (user.isDeleted) {
      return res.status(409).json({ message: 'Compte déjà supprimé' });
    }

    // Vérifier mot de passe
    const ok = await user.comparePassword(currentPassword);
    if (!ok) return res.status(401).json({ message: 'Mot de passe incorrect' });

    // Règles demandées:
    // - Locataire: supprimer le compte et TOUTES ses réservations (+ paiements liés)
    // - Propriétaire: rendre ses bateaux indisponibles
    let deletedReservations = 0;
    let deletedPayments = 0;
    let updatedBoats = 0;
    if (user.role === 'locataire') {
      const reservations = await Reservation.find({ user: user._id }).select('_id');
      const reservationIds = reservations.map(r => r._id);
      if (reservationIds.length > 0) {
        const payResult = await Payment.deleteMany({ reservation: { $in: reservationIds } });
        deletedPayments = payResult?.deletedCount || 0;
        const resResult = await Reservation.deleteMany({ _id: { $in: reservationIds } });
        deletedReservations = resResult?.deletedCount || 0;
      }
    } else if (user.role === 'propriétaire') {
      const upd = await Boat.updateMany({ owner: user._id }, { $set: { status: 'indisponible' } });
      updatedBoats = upd?.modifiedCount || 0;
    }

    // HARD DELETE: supprimer définitivement l'utilisateur de la BDD
    await User.findByIdAndDelete(user._id);

    return res.json({ 
      message: 'Compte supprimé définitivement avec succès',
      details: {
        role: user.role,
        deletedReservations,
        deletedPayments,
        updatedBoats
      }
    });
  } catch (err) {
    console.error('deleteMe error:', err);
    return res.status(500).json({ message: err.message });
  }
};
