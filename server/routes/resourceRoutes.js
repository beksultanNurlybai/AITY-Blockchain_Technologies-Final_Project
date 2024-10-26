const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

router.get('/main', resourceController.mainPage);

module.exports = router;