const mongoose = require('mongoose');

const boatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, required: true },
  port: { type: String, required: true },
  length: { type: Number, required: true },
  capacity: { type: Number, required: true }, // Nombre de personnes max
  cabins: { type: Number, required: true }, // Nombre de cabines
  skipper: { type: Boolean, required: true }, // Skipper obligatoire ?
  description: { type: String },
  dailyPrice: { type: Number, required: true }, // Prix journalier en euros
  photos: [{ type: String }],
  status: { type: String, enum: ['disponible', 'en location'], default: 'disponible' },
  features: [{ type: String }], // équipements
technicalSpecs: {             // caractéristiques techniques
  year: String,
  engine: String,
  fuelCapacity: String,
  maxSpeed: String,
  weight: String
},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Boat', boatSchema);
