const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const fileController = require('./controllers/fileController');
const mainController = require('./controllers/mainController');


router.get('/', mainController.mainPage);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

// router.get('/profile', mainController.profilePage);
router.post('/upload', fileController.upload);

module.exports = router;
