const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware minimal pour vérifier le rôle admin
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé à l\'administrateur.' });
  }
  next();
}

// Route de test protégée
router.get('/admin/ping', authMiddleware, requireAdmin, (req, res) => {
  res.status(200).json({ message: 'pong (admin)' });
});

module.exports = router;
