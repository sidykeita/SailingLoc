const express = require('express');
const router = express.Router();
const boatController = require('../controllers/boatController');

const { protect } = require('../controllers/authController');

router.post('/', protect, boatController.createBoat);
router.get('/my-boats', protect, boatController.getUserBoats);
router.get('/', boatController.getBoats);
router.get('/:id', boatController.getBoatById);
router.put('/:id', boatController.updateBoat);
router.delete('/:id', boatController.deleteBoat);

module.exports = router;
