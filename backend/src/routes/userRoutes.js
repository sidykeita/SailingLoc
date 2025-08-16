const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// PATCH /api/users/:id
router.patch('/:id', authMiddleware, userController.updateProfile);

module.exports = router;
