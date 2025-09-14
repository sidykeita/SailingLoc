const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['carte', 'virement', 'paypal', 'espèces'], default: 'carte' },
  status: { type: String, enum: ['en_attente', 'effectué', 'échoué'], default: 'en_attente' },
  paymentDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
