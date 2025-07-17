const mongoose = require('mongoose');

const boatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  length: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Boat', boatSchema);
