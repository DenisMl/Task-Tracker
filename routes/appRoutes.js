var express = require('express');
var router = express.Router();
var appController = require('../controllers/appController');

router.get('/getUserInfo', appController.getUserInfo);
router.get('/getProjectsInfo', appController.getProjectsInfo);
router.post('/createProject', appController.createProject);
router.post('/deleteProject', appController.deleteProject);
router.post('/createTask', appController.createTask);


module.exports = router;
