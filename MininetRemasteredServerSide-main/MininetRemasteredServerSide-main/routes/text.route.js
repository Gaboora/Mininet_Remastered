const express = require('express');
const router = express.Router();
const textController = require('../controllers/text.controller')

router.route('/').post(textController.addText)
module.exports = router;