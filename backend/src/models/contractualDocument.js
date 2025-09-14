const mongoose = require('mongoose');

const contractualDocumentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  documentType: {
    type: String,
    enum: ['contratLocation', 'attestationAssurance', 'cvMarin', 'permisBateau'],
    required: true
  },
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  firebaseUrl: { type: String, required: true }, // URL Firebase Storage
  firebasePath: { type: String, required: true }, // Chemin dans Firebase
  uploadedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: { type: String },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date }
});

// Index composé pour éviter les doublons (un seul document par type par utilisateur)
contractualDocumentSchema.index({ userId: 1, documentType: 1 }, { unique: true });

module.exports = mongoose.models.ContractualDocument || mongoose.model('ContractualDocument', contractualDocumentSchema);
