const ContractualDocument = require('../models/contractualDocument');
const admin = require('../config/firebaseAdmin');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Configuration multer pour l'upload en mémoire
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté. Utilisez PDF, JPG ou PNG.'), false);
    }
  }
});

// Middleware multer pour l'upload
exports.uploadMiddleware = upload.single('document');

// Upload d'un document contractuel
exports.uploadDocument = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return res.status(401).json({ message: 'Non authentifié' });

    const { documentType } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    if (!documentType || !['contratLocation', 'attestationAssurance', 'cvMarin', 'permisBateau'].includes(documentType)) {
      return res.status(400).json({ message: 'Type de document invalide' });
    }

    // Générer un nom de fichier unique
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${documentType}_${userId}_${uuidv4()}.${fileExtension}`;
    const firebasePath = `contractual-documents/${userId}/${fileName}`;

    // Upload vers Firebase Storage
    const bucket = admin.storage().bucket();
    const fileUpload = bucket.file(firebasePath);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        console.error('Erreur upload Firebase:', error);
        reject(new Error('Erreur lors de l\'upload du fichier'));
      });

      stream.on('finish', async () => {
        try {
          let firebaseUrl;
          // Tenter de rendre le fichier public, sinon générer une URL signée
          try {
            await fileUpload.makePublic();
            firebaseUrl = `https://storage.googleapis.com/${bucket.name}/${firebasePath}`;
          } catch (pubErr) {
            console.warn('[contractualDocumentController] makePublic failed, fallback to signed URL:', pubErr?.message || pubErr);
            try {
              const [url] = await fileUpload.getSignedUrl({ action: 'read', expires: '2099-01-01' });
              firebaseUrl = url;
            } catch (signErr) {
              console.error('[contractualDocumentController] getSignedUrl failed:', signErr);
              return resolve(res.status(500).json({ message: 'Echec accès fichier (public/signed URL)' }));
            }
          }

          // Supprimer l'ancien document du même type s'il existe
          await ContractualDocument.findOneAndDelete({ userId, documentType });

          // Sauvegarder les métadonnées en base
          const document = new ContractualDocument({
            userId,
            documentType,
            fileName,
            originalName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            firebaseUrl,
            firebasePath,
          });

          await document.save();
          resolve(res.status(201).json(document));
        } catch (error) {
          console.error('Erreur sauvegarde document:', error);
          reject(new Error('Erreur lors de la sauvegarde du document'));
        }
      });

      stream.end(file.buffer);
    });
  } catch (error) {
    console.error('Erreur upload document:', error);
    res.status(500).json({ message: error.message || 'Erreur serveur' });
  }
};

// Récupérer les documents d'un utilisateur
exports.getUserDocuments = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return res.status(401).json({ message: 'Non authentifié' });

    const documents = await ContractualDocument.find({ userId }).sort({ uploadedAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un document
exports.deleteDocument = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    const { id } = req.params;

    if (!userId) return res.status(401).json({ message: 'Non authentifié' });

    const document = await ContractualDocument.findOne({ _id: id, userId });
    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    // Supprimer de Firebase Storage
    try {
      const bucket = admin.storage().bucket();
      await bucket.file(document.firebasePath).delete();
    } catch (firebaseError) {
      console.warn('Erreur suppression Firebase:', firebaseError);
    }

    // Supprimer de la base de données
    await ContractualDocument.findByIdAndDelete(id);
    res.json({ message: 'Document supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware multer
exports.uploadMiddleware = upload.single('document');

module.exports = exports;
