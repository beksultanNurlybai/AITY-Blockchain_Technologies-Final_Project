const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const fileController = require('./controllers/fileController');
const mainController = require('./controllers/mainController');
const contractController = require('./controllers/contractController');

router.get('/', mainController.mainPage);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

router.get('/resource/:id', mainController.detailPage);
router.post('/resource/buy', userController.buyResource);

router.get('/contract-info', contractController.info);
router.post('/register-provider', contractController.registerProvider);

router.get('/workplace', mainController.workplacePage);
router.post('/upload', fileController.upload);

module.exports = router;
