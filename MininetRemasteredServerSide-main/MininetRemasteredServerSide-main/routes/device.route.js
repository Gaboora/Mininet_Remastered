const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller')

router.route('/').post(deviceController.addDevice)
router.route('/:id').get(deviceController.getAllDevice).delete(deviceController.removeDevice).post(deviceController.updateDevice)
module.exports = router;