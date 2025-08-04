const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');

router.post('/photos', photoController.createPhoto);
router.get('/photos', photoController.getPhotos);
router.get('/photos/:id', photoController.getPhotoById);
router.put('/photos/:id', photoController.updatePhoto);
router.delete('/photos/:id', photoController.deletePhoto);

module.exports = router;
