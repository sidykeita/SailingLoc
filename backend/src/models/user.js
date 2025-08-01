// src/models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },  // Tu peux séparer en firstName / lastName si tu veux
  lastName: { type: String, required: true },  // Tu peux séparer en firstName / lastName si tu veux
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },                  // Nouveau champ optionnel
  role: { type: String, enum: ['locataire', 'propriétaire'], default: 'locataire' }, // Nouveau champ
  createdAt: { type: Date, default: Date.now } // Automatique à la création
});

module.exports = mongoose.model('User', userSchema);