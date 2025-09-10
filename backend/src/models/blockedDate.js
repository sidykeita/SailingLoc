// src/models/blockedDate.js
const mongoose = require('mongoose');

const blockedDateSchema = new mongoose.Schema({
  boat: { type: mongoose.Schema.Types.ObjectId, ref: 'Boat', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, enum: ['maintenance', 'personnel', 'inspection', 'autre'], required: true },
  notes: { type: String },
  locked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlockedDate', blockedDateSchema);
