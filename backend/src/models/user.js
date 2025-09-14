// src/models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Champ optionnel pour le téléphone (unique uniquement quand présent)
  phone: { type: String, unique: true, sparse: true },
  // URLs des fichiers stockés (Firebase Storage)
  profilePhotoUrl: { type: String },
  idCardUrl: { type: String },
  role: { 
    type: String, 
    enum: ['locataire', 'propriétaire', 'admin'], 
    default: 'locataire' 
  },
  // Statut propriétaire et informations professionnelles
  ownerStatus: {
    type: String,
    enum: ['particulier', 'professionnel'],
    default: 'particulier'
  },
  siret: { type: String, sparse: true }, // 14 chiffres pour les professionnels
  siren: { type: String, sparse: true }, // 9 chiffres pour les professionnels
  createdAt: { type: Date, default: Date.now },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Boat' }],
  // Soft delete
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
});

// Ajout de la méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Seule la comparaison hashée est autorisée
  return await bcrypt.compare(candidatePassword, this.password);
};

// Ajout du hashage automatique du mot de passe avant sauvegarde
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);