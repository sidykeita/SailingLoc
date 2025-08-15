const OwnerDocuments = require('../models/ownerDocuments');
const path = require('path');
const fs = require('fs');

// GET /api/owner-docs/:ownerId
exports.getDocs = async (req, res) => {
  try {
    const docs = await OwnerDocuments.findOne({ owner: req.params.ownerId });
    res.json(docs || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/owner-docs/upload
exports.uploadDoc = async (req, res) => {
  try {
    const { type } = req.body; // 'contract', 'insurance', 'cv', 'permit'
    if (!req.file) return res.status(400).json({ message: 'Aucun fichier envoyé' });
    if (!['contract','insurance','cv','permit'].includes(type)) return res.status(400).json({ message: 'Type de document invalide' });
    // Crée ou met à jour l'entrée OwnerDocuments
    let docs = await OwnerDocuments.findOne({ owner: req.user.id });
    if (!docs) docs = new OwnerDocuments({ owner: req.user.id });
    // Supprime l'ancien fichier si présent
    if (docs[type]) {
      try { fs.unlinkSync(path.join(__dirname, '../../uploads/', path.basename(docs[type]))); } catch(e) {}
    }
    docs[type] = `/uploads/${req.file.filename}`;
    await docs.save();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/owner-docs/upload-url (Firebase)
exports.uploadDocUrl = async (req, res) => {
  try {
    const { type, url, ownerId: ownerIdBody } = req.body;
    const ownerId = req.user?.id || ownerIdBody || req.params.ownerId;
    console.log('DEBUG uploadDocUrl:', { ownerId, type, url });
    if (!url || !type) return res.status(400).json({ message: 'Type ou URL manquant' });
    if (!['contract','insurance','cv','permit'].includes(type)) return res.status(400).json({ message: 'Type de document invalide' });
    if (!ownerId) return res.status(400).json({ message: 'Owner ID manquant' });
    let docs = await OwnerDocuments.findOne({ owner: ownerId });
    if (!docs) docs = new OwnerDocuments({ owner: ownerId });
    docs[type] = url;
    await docs.save();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/owner-docs/:ownerId/:type
exports.deleteDoc = async (req, res) => {
  try {
    const { type } = req.params;
    if (!['contract','insurance','cv','permit'].includes(type)) return res.status(400).json({ message: 'Type de document invalide' });
    const docs = await OwnerDocuments.findOne({ owner: req.params.ownerId });
    if (!docs || !docs[type]) return res.status(404).json({ message: 'Document non trouvé' });
    // Supprime le fichier physique
    try { fs.unlinkSync(path.join(__dirname, '../../uploads/', path.basename(docs[type]))); } catch(e) {}
    docs[type] = undefined;
    await docs.save();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
