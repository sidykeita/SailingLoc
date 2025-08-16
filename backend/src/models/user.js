// src/models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, unique: true },  // Champ optionnel pour le téléphone
  role: { 
    type: String, 
    enum: ['locataire', 'propriétaire', 'admin'], 
    default: 'locataire' 
  },
  createdAt: { type: Date, default: Date.now }
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

module.exports = mongoose.model('User', userSchema);