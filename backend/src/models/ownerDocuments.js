const mongoose = require('mongoose');

const OwnerDocumentsSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  contract: String,      // Chemin ou URL du fichier contrat
  insurance: String,    // Chemin ou URL du fichier assurance
  cv: String,           // Chemin ou URL du CV marin
  permit: String,       // Chemin ou URL du permis bateau
  // Ajoute d'autres champs si besoin
});

module.exports = mongoose.model('OwnerDocuments', OwnerDocumentsSchema);
