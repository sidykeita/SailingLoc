const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  boat: { type: mongoose.Schema.Types.ObjectId, ref: 'Boat', required: true },
  caption: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Photo', photoSchema);
