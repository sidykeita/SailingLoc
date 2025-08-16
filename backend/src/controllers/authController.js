const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Middleware de protection
exports.protect = async (req, res, next) => {
  try {
    // 1) Vérifier si le token existe
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Vous n\'êtes pas connecté' });
    }

    // 2) Vérifier si le token est valide
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Vérifier si l'utilisateur existe toujours
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'L\'utilisateur n\'existe plus' });
    }

    // 4) Passer l'utilisateur au middleware suivant
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Créer l'utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || 'locataire'
    });

    // Créer le token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '90d'
    });

    // Ne pas envoyer le mot de passe dans la réponse
    const userData = { ...user.toObject() };
    delete userData.password;

    res.status(201).json({
      token,
      user: userData
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[LOGIN] Email reçu:', email);
    console.log('[LOGIN] Password reçu:', password);

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('[LOGIN] Aucun user trouvé pour cet email');
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    console.log('[LOGIN] User trouvé, hash password:', user.password);
    console.log('[DEBUG] password reçu:', password);
    console.log('[DEBUG] hash stocké:', user.password);
    const isMatch = await user.comparePassword(password);
    console.log('[LOGIN] Résultat comparaison bcrypt:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Créer le token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '8h'
    });

    // Ne pas envoyer le mot de passe dans la réponse
    const userData = { ...user.toObject() };
    delete userData.password;

    res.status(200).json({
      token,
      user: userData
    });
  } catch (err) {
    console.error('[LOGIN] Erreur catch:', err);
    res.status(400).json({ message: err.message });
  }
};

// Déconnexion
exports.logout = async (req, res) => {
  try {
    // On pourrait implémenter une liste noire pour les tokens
    // Pour l'instant, on renvoie juste une réponse de succès
    res.status(200).json({ message: 'Déconnecté avec succès' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obtenir les informations de l'utilisateur connecté
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    // Ne pas envoyer le mot de passe dans la réponse
    const userData = { ...req.user.toObject() };
    delete userData.password;

    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
