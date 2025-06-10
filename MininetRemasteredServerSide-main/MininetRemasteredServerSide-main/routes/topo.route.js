const express = require('express');
const router = express.Router();
const topoController = require('../controllers/topo.controller')

router.route('/:id').get(topoController.getTopoById).put(topoController.updateTopo)
router.route('/').post(topoController.addTopology)

module.exports = router;