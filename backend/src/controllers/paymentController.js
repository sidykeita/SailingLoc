const Payment = require('../models/payment');

// Créer un paiement
exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obtenir tous les paiements
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('reservation');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir un paiement par ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('reservation');
    if (!payment) return res.status(404).json({ message: "Paiement non trouvé" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modifier un paiement
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) return res.status(404).json({ message: "Paiement non trouvé" });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un paiement
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Paiement non trouvé" });
    res.json({ message: "Paiement supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
