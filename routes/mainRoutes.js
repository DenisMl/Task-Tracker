let express = require('express');
let router = express.Router();
let mainController = require('../controllers/mainController');

router.get('/', mainController.mainPage);
router.get('/login', mainController.loginPage);
router.get('/register', mainController.registerPage);
router.post('/login', mainController.login);
router.post('/logout', mainController.logout);
router.post('/register', mainController.register);

module.exports = router;
