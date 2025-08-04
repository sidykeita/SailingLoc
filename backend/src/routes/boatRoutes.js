const express = require('express');
const router = express.Router();
const boatController = require('../controllers/boatController');

router.post('/', boatController.createBoat);
router.get('/', boatController.getBoats);
router.get('/:id', boatController.getBoatById);
router.put('/:id', boatController.updateBoat);
router.delete('/:id', boatController.deleteBoat);

module.exports = router;
