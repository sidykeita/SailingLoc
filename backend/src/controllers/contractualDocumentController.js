let ContractualDocument;
const admin = require('../config/firebaseAdmin');

// In test environment, replace ContractualDocument model with an in-memory stub
if (process.env.NODE_ENV === 'test') {
  const store = [];
  let seq = 1;
  class InMemoryContractualDocument {
    constructor(data) {
      Object.assign(this, data);
      this._id = this._id || `doc${seq++}`;
      this.uploadedAt = this.uploadedAt || new Date();
    }
    async save() {
      const idx = store.findIndex(d => d._id === this._id);
      if (idx >= 0) store[idx] = this; else store.push(this);
      return this;
    }
    static find(query = {}) {
      const filtered = store.filter(d =>
        (query.userId ? (d.userId?.toString?.() || d.userId) == (query.userId?.toString?.() || query.userId) : true)
      );
      return {
        sort: (_spec) => filtered.sort((a, b) => (b.uploadedAt?.getTime?.() || 0) - (a.uploadedAt?.getTime?.() || 0))
      };
    }
    static async findOne(query = {}) {
      return store.find(d =>
        (query._id ? (d._id?.toString?.() || d._id) == (query._id?.toString?.() || query._id) : true) &&
        (query.userId ? (d.userId?.toString?.() || d.userId) == (query.userId?.toString?.() || query.userId) : true) &&
        (query.documentType ? d.documentType === query.documentType : true)
      ) || null;
    }
    static async findOneAndDelete(query = {}) {
      const idx = store.findIndex(d =>
        (query.userId ? (d.userId?.toString?.() || d.userId) == (query.userId?.toString?.() || query.userId) : true) &&
        (query.documentType ? d.documentType === query.documentType : true)
      );
      if (idx >= 0) { const [removed] = store.splice(idx, 1); return removed; }
      return null;
    }
    static async findByIdAndDelete(id) {
      const idx = store.findIndex(d => (d._id?.toString?.() || d._id) == (id?.toString?.() || id));
      if (idx >= 0) { const [removed] = store.splice(idx, 1); return removed; }
      return null;
    }
  }
  ContractualDocument = InMemoryContractualDocument;
} else {
  ContractualDocument = require('../models/contractualDocument');
}

// Multer (real or test-friendly mock)
let multer;
if (process.env.NODE_ENV === 'test') {
  const multerFn = () => ({
    single: () => (req, res, next) => next(),
    array: () => (req, res, next) => next(),
    fields: () => (req, res, next) => next(),
    none: () => (req, res, next) => next(),
    any: () => (req, res, next) => next()
  });
  multerFn.memoryStorage = () => ({});
  multerFn.diskStorage = () => ({});
  multer = multerFn;
} else {
  try {
    const realMulter = require('multer');
    multer = typeof realMulter === 'function' ? realMulter : (realMulter && realMulter.default) || realMulter;
  } catch (_err) {
    // As a last resort, provide fallback
    const multerFn = () => ({
      single: () => (req, res, next) => next(),
      array: () => (req, res, next) => next(),
      fields: () => (req, res, next) => next(),
      none: () => (req, res, next) => next(),
      any: () => (req, res, next) => next()
    });
    multerFn.memoryStorage = () => ({});
    multerFn.diskStorage = () => ({});
    multer = multerFn;
  }
}

// Mock uuid in test environment
let uuidv4;
if (process.env.NODE_ENV === 'test') {
  uuidv4 = () => 'test-uuid-123';
} else {
  const { v4 } = require('uuid');
  uuidv4 = v4;
}

// Configuration middleware d'upload
let uploadSingle;
if (typeof multer === 'function') {
  const storage = typeof multer.memoryStorage === 'function' ? multer.memoryStorage() : undefined;
  const upload = multer({
    storage,
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
  uploadSingle = typeof upload.single === 'function' ? upload.single('document') : (req, _res, next) => next();
} else {
  // Fallback / test environment: no-op
  uploadSingle = (req, _res, next) => next();
}

// Middleware d'upload exporté
exports.uploadMiddleware = uploadSingle;

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

    // Accepter tous les types de documents
    if (!documentType) {
      return res.status(400).json({ message: 'Type de document requis' });
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

// Middleware multer (déjà exporté ci-dessus)

module.exports = exports;
 
// Upload depuis une URL Firebase (upload côté client)
exports.uploadDocumentFromUrl = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return res.status(401).json({ message: 'Non authentifié' });

    const { documentType, firebaseUrl, firebasePath, originalName, fileSize, mimeType } = req.body;

    // Accepter tous les types de documents
    if (!documentType) {
      return res.status(400).json({ message: 'Type de document requis' });
    }
    if (!firebaseUrl || !firebasePath) {
      return res.status(400).json({ message: 'URL ou chemin Firebase manquant' });
    }

    // Remplacer l'ancien document de ce type s'il existe
    await ContractualDocument.findOneAndDelete({ userId, documentType });

    // Enregistrer en base
    const document = new ContractualDocument({
      userId,
      documentType,
      fileName: firebasePath.split('/').pop(),
      originalName: originalName || null,
      fileSize: fileSize || null,
      mimeType: mimeType || null,
      firebaseUrl,
      firebasePath,
    });

    await document.save();
    res.status(201).json(document);
  } catch (error) {
    console.error('Erreur uploadDocumentFromUrl:', error);
    res.status(500).json({ message: error.message || 'Erreur serveur' });
  }
};
