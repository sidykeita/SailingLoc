const express = require('express');
const router = express.Router();
const contractualDocumentController = require('../controllers/contractualDocumentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// POST /api/contractual-documents/upload - Upload d'un document
router.post('/upload', 
  contractualDocumentController.uploadMiddleware,
  contractualDocumentController.uploadDocument
);

// POST /api/contractual-documents/upload-url - Enregistrer un document déjà uploadé côté client (Firebase)
router.post('/upload-url', contractualDocumentController.uploadDocumentFromUrl);

// GET /api/contractual-documents - Récupérer les documents de l'utilisateur connecté
router.get('/', contractualDocumentController.getUserDocuments);

// DELETE /api/contractual-documents/:id - Supprimer un document
router.delete('/:id', contractualDocumentController.deleteDocument);

module.exports = router;
