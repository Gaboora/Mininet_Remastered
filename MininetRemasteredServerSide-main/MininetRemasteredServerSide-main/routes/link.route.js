const express = require('express');
const router = express.Router();
const linkController = require('../controllers/link.controller')

router.route('/').post(linkController.addLink)
module.exports = router;