const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register', authController.registerUser);
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;
