const User = require('../models/user');

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
