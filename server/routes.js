const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const fileController = require('./controllers/fileController');
const mainController = require('./controllers/mainController');


router.get('/main', mainController.mainPage);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.get('/profile', mainController.profilePage);
router.get('/upload', mainController.upload);

module.exports = router;
