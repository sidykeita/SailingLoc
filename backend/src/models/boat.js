const mongoose = require('mongoose');

const boatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  length: { type: Number, required: true },
  capacity: { type: Number, required: true }, // Nombre de personnes max
  cabins: { type: Number, required: true }, // Nombre de cabines
  licenseRequired: { type: Boolean, required: true }, // Permis nécessaire ?
  description: { type: String },
  dailyPrice: { type: Number, required: true }, // Prix journalier en euros
  photos: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Boat', boatSchema);
