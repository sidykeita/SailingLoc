const express = require('express');
const router = express.Router();
const boatController = require('../controllers/boatController');

router.post('/boats', boatController.createBoat);
router.get('/boats', boatController.getBoats);
router.get('/boats/:id', boatController.getBoatById);
router.put('/boats/:id', boatController.updateBoat);
router.delete('/boats/:id', boatController.deleteBoat);

module.exports = router;
