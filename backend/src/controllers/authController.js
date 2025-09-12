const User = require('../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ContractualDocument = require('../models/contractualDocument');

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

// Inscription (atomique avec documents contractuels)
exports.register = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { firstName, lastName, email, password, phone, role, ownerStatus, siret, siren, documents } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Vérifier la présence des 4 documents (obligatoires à l'inscription propriétaire)
    if (role === 'propriétaire') {
      const requiredTypes = ['contratLocation', 'attestationAssurance', 'cvMarin', 'permisBateau'];
      const provided = Array.isArray(documents) ? documents.map(d => d.documentType) : [];
      const missing = requiredTypes.filter(t => !provided.includes(t));
      if (missing.length > 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Documents manquants: ${missing.join(', ')}` });
      }
    }

    // Préparer les données utilisateur
    const userData = {
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || 'locataire'
    };

    // Ajouter les champs propriétaire si nécessaire
    if (role === 'propriétaire') {
      userData.ownerStatus = ownerStatus || 'particulier';
      if (ownerStatus === 'professionnel') {
        userData.siret = siret;
        userData.siren = siren;
      }
    }

    // Créer l'utilisateur
    const user = await User.create([userData], { session });
    const createdUser = Array.isArray(user) ? user[0] : user;

    // Créer les documents contractuels s'il s'agit d'un propriétaire
    if (role === 'propriétaire' && Array.isArray(documents) && documents.length > 0) {
      const docsToInsert = documents.map(d => ({
        userId: createdUser._id,
        documentType: d.documentType,
        fileName: (d.firebasePath || '').split('/').pop(),
        originalName: d.originalName,
        fileSize: d.fileSize,
        mimeType: d.mimeType,
        firebaseUrl: d.firebaseUrl,
        firebasePath: d.firebasePath,
      }));
      await ContractualDocument.insertMany(docsToInsert, { session });
    }

    await session.commitTransaction();
    session.endSession();

    // Créer le token
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
      expiresIn: '90d'
    });

    // Ne pas envoyer le mot de passe dans la réponse
    const userResponse = { ...createdUser.toObject() };
    delete userResponse.password;

    res.status(201).json({
      token,
      user: userResponse
    });
  } catch (err) {
    try { await session.abortTransaction(); } catch(_) {}
    session.endSession();
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
    if (user.isDeleted) {
      return res.status(403).json({ message: 'Ce compte a été supprimé' });
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
