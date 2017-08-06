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
            console.error('>> ' + err);
            res.redirect('/login');
        } else {
            res.json(userInfo);
        }
    });
};

appController.getProjectsInfo = function(req, res) {
    if (req.body.isManager) {
        appController.getProjectsInfoForManager(req, res);
    } else {
        appController.getProjectsInfoForDeveloper(req, res);
    }
};

appController.getProjectsInfoForManager = function(req, res) {
    async.waterfall([
        function(callback) {
            Project.find({
                author: req.session.user
            }, callback);
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
            console.error('>> ' + err);
            res.end();
        } else {
            res.json(projectsInfo);
        }
    });
};

appController.getProjectsInfoForDeveloper = function(req, res) {
    async.waterfall([
        function(callback) {
            // PersonModel.find({ favouriteFoods: "sushi" }, ...);
            Project.find({
                developers: req.session.user
            }, callback);
        },
        function(projects, callback) {
            if (projects) {
                callback(null, projects);
            } else {
                callback('projects not found');
            }
        }
    ], function(err, projectsInfo) {
        if (err) {
            console.error('>> ' + err);
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
                let project = new Project({projectName: req.body.projectName, author: req.session.user});
                project.save(function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, project);
                    }
                });
            }
        }
    ], function(err, project) {
        if (err) {
            console.error('>> ' + err);
            res.end();
        } else {
            res.end('ok');
        }
    });

};

appController.deleteProject = function(req, res) {
    Project.findByIdAndRemove(req.body.projectId, function(err, project) {
        if (err) {
            console.error('>> ' + err);
            res.end();
        }
        res.send(project);
    });
};

appController.deleteTask = function(req, res) {
    Project.findByIdAndUpdate(req.body.projectId, { //id of project
        $pull: {
            'tasks': {
                _id: req.body.taskId
            }
        }
    }, function(err, task) {
        if (err) {
            console.error('>> ' + err);
            res.end();
        } else {
            res.send(task);
        }
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
        upsert: true,
        new: true
    }, function(err, task) {
        if (err) {
            console.error('>> ' + err);
            res.end();
        } else {
            res.send(task);
        }
    });
};

appController.addDevToProject = function(req, res) {
    let developers;
    async.waterfall([
        function(callback) {
            Project.findById(req.body.projectId, 'developers', callback);
        },
        function(project, callback) {
            developers = project.developers;
            req.body.devsId.map(function(devId) {
                if (project.developers.indexOf(devId) === -1) { //includes don't work properely
                    developers.push(devId);
                }
            });
            callback(null, developers);
        },
        function(developers, callback) {
            Project.findByIdAndUpdate(req.body.projectId, {
                developers: developers
            }, {
                new: true
            }, callback);
        }
    ], function(err, updProj) {
        if (err) {
            console.error('>> ' + err);
            res.end();
        } else {
            res.send(updProj.developers);
        }
    });
};

appController.getAllDevs = function(req, res) {
    User.find({
        isManager: false
    }, function(err, users) {
        if (err) {
            console.error('>> Users not found' + err);
            res.end();
        } else {
            users = users.map((user) => {
                return {'email': user.email, 'firstName': user.firstName, 'lastName': user.lastName, '_id': user._id, 'created': user.created}
            });
            res.json(users);
        }
    });
};

appController.getProjectDevelopers = function(req, res) {
    User.find({
        _id: {
            $in: req.body.projectDevelopers
        }
    }, function(err, developers) {
        if (err) {
            console.error('>> Users not found' + err);
            res.end();
        } else {
            developers = developers.map((user) => {
                return {'email': user.email, 'firstName': user.firstName, 'lastName': user.lastName, '_id': user._id, 'created': user.created}
            });
            res.json(developers);
        }
    });
};

appController.getTaskDevelopers = function(req, res) {
    User.find({
        _id: {
            $in: req.body.taskDevelopers
        }
    }, function(err, developers) {
        if (err) {
            console.error('>> Users not found' + err);
            res.end();
        } else {
            developers = developers.map((user) => {
                return {'email': user.email, 'firstName': user.firstName, 'lastName': user.lastName, '_id': user._id, 'created': user.created}
            });
            res.json(developers);
        }
    });
};

appController.addDevToTask = function(req, res) {
    let developers;
    async.waterfall([
        function(callback) {
            Project.findOne({
                '_id': req.body.projectId
                // 'tasks._id': req.body.taskId
            }, callback);
        },
        function(project, callback) {
            let task = project.tasks.find(function(task) {
                if (task._id == req.body.taskId) {
                    return true;
                }
            });
            developers = task.developers;
            req.body.devsId.map(function(devId) {
                if (task.developers.indexOf(devId) === -1) {
                    developers.push(devId);
                }
            });
            callback(null, developers);
        },
        function(developers, callback) {
            Project.findOneAndUpdate({
                '_id': req.body.projectId,
                'tasks._id': req.body.taskId
            }, {
                $set: {
                    'tasks.$.developers': developers
                }
            }, {
                new: true
            }, callback);

        }
    ], function(err, updProj) {
        if (err) {
            console.error('>> ' + err);
            res.end();
        } else {
            let taskDevelopers = updProj.tasks.find(function(task) {
                if (task._id == req.body.taskId) {
                    return true;
                }
            }).developers;
            res.send(taskDevelopers);
        }
    });
};

appController.changeTaskStatus = function(req, res) {
    Project.findOneAndUpdate({
        '_id': req.body.projectId,
        'tasks._id': req.body.taskId
    }, {
        $set: {
            'tasks.$.status': req.body.status
        }
    }, function(err, updProj) {
        if (err) {
            console.error('>> ' + err);
            res.end();
        } else {
            res.send();
        }
    });
};

appController.addComment = function(req, res) {
    Project.findOneAndUpdate({
        '_id': req.body.projectId,
        'tasks._id': req.body.taskId
    }, {
        $push: {
            'tasks.$.comments': {
                author: req.session.user,
                text: req.body.commentText
            }
        }
    }, {
        upsert: true,
        new: true
    }, function(err, updProj) {
        if (err) {
            console.error('>> ' + err);
            res.end();
        } else {
            let task = updProj.tasks.find(function(task) {
                if (task._id == req.body.taskId) {
                    return true;
                }
            });
            let authorsIDs = task.comments.map(function(comment) {
                return comment.author;
            });
            res.json(authorsIDs);
        }
    });
};

appController.getCommentsAuthors = function(req, res) {
    User.find({
        _id: {
            $in: req.body.authorsIDs
        }
    }, function(err, authors) {
        if (err) {
            console.error('>> Users not found' + err);
            res.end();
        } else {
            let result = authors.map((user) => {
                return {'email': user.email, 'firstName': user.firstName, 'lastName': user.lastName, '_id': user._id, 'isManager': user.isManager}
            });
            res.json(result);
        }
    });
};

module.exports = appController;
