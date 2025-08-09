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
    enum: ['locataire', 'propriétaire'], 
    default: 'locataire' 
  },
  createdAt: { type: Date, default: Date.now }
});

// Ajout de la méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  // 1. Essai normal avec bcrypt
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  if (isMatch) return true;

  // 2. Si le hash ne matche pas, on tente la comparaison en clair (pour les vieux comptes mock)
  if (candidatePassword === this.password) {
    // On migre le mot de passe en hashé pour les prochaines connexions
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(candidatePassword, salt);
    await this.save();
    return true;
  }

  // 3. Sinon, échec
  return false;
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