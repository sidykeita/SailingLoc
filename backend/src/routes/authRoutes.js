const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// Routes d'authentification
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/user', authController.protect, authController.getCurrentUser);

// Routes utilisateurs (protégées)
router.use(authController.protect);

router.route('/users')
  .get(userController.getAllUsers);

router.route('/users/:id')
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
