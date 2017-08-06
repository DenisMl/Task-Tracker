var express = require('express');
var router = express.Router();
var appController = require('../controllers/appController');

router.get('/getUserInfo', appController.getUserInfo);
router.post('/getProjectsInfo', appController.getProjectsInfo);
router.post('/createProject', appController.createProject);
router.post('/deleteProject', appController.deleteProject);
router.post('/createTask', appController.createTask);
router.post('/deleteTask', appController.deleteTask);
router.post('/addDevToProject', appController.addDevToProject);
router.post('/addDevToTask', appController.addDevToTask);
router.get('/getAllDevs', appController.getAllDevs);
router.post('/getProjectDevelopers', appController.getProjectDevelopers);
router.post('/getTaskDevelopers', appController.getTaskDevelopers);
router.post('/changeTaskStatus', appController.changeTaskStatus);
router.post('/addComment', appController.addComment);
router.post('/getCommentsAuthors', appController.getCommentsAuthors);


module.exports = router;
