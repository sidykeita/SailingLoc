const express = require('express');
const router = express.Router();
const ownerDocsController = require('../controllers/ownerDocs.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// GET tous les documents d'un propriétaire
router.get('/:ownerId', authMiddleware, ownerDocsController.getDocs);

// POST upload d'une URL (Firebase)
router.post('/upload-url', authMiddleware, ownerDocsController.uploadDocUrl);

// DELETE un document
router.delete('/:ownerId/:type', authMiddleware, ownerDocsController.deleteDoc);

module.exports = router;
