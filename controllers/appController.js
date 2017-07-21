let User = require('../models/user');
let Project = require('../models/project');
let async = require('async');

let appController = {};

appController.getUserInfo = function(req, res) {
    let userInfo = {};

    async.waterfall([
        function(callback) {
            User.findOne({
                _id: req.session.user
            }, callback);
        },
        function(user, callback) { //1st arg: user or null
            if (user) {
                userInfo = {
                    'email': user.email,
                    'firstName': user.firstName,
                    'lastName': user.lastName,
                    'isManager': user.isManager
                }
                callback(null, userInfo);
            } else {
                callback('user not found');
            }
        }
    ], function(err, userInfo) {
        if (err) {
            console.log('>> ' + err);
            res.redirect('/login');
        } else {
            res.json(userInfo);
        }
    });
};

appController.getProjectsInfo = function(req, res) {
    // let projectsInfo = {};

    async.waterfall([
        function(callback) {
            Project.find(null, callback);
        },
        function(projects, callback) { //1st arg: projects or null
            if (projects) {
                callback(null, projects);
            } else {
                callback('projects not found');
            }
        }
    ], function(err, projectsInfo) {
        if (err) {
            console.log('>> ' + err);
            res.end();
        } else {
            res.json(projectsInfo);
        }
    });
};

appController.createProject = function(req, res) {

    async.waterfall([
        function(callback) {
            Project.findOne({
                projectName: req.body.projectName
            }, callback);
        },
        function(project, callback) {
            if (project) {
                callback('Project with this name already exists');
            } else {
                console.log('>>>>>>>');
                console.log(req.body);
                let project = new Project({projectName: req.body.projectName, author: req.session.user});
                project.save(function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log('>>New Project: ');
                        console.log(project);
                        callback(null, project);
                    }
                });
            }
        }
    ], function(err, project) {
        if (err) {
            console.log('>> ' + err);
            res.end();
        } else {
            res.end('ok');
        }
    });

};

appController.deleteProject = function(req, res) {
    Project.findByIdAndRemove(req.body.projectId, function(err, project) {
        if (err) {
            console.log('>> ' + err);
            res.end();
        }
        console.log(project);
        res.send(project);
    });
};

appController.createTask = function(req, res) {
    Project.findByIdAndUpdate(req.body.projectId, { //id of project
        $push: {
            'tasks': {
                taskName: req.body.taskName,
                author: req.session.user
            }
        }
    }, {
        // safe: true,
        upsert: true,
        new: true
    }, function(err, task) {
        if (err) {
            console.log('>> ' + err);
            res.end();
        } else {
            res.send(task);
        }
    });
};

module.exports = appController;
