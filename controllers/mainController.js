let User = require('../models/user');
let async = require('async');
// let Project = require('../models/project');
// let fs = require('fs');
let mainController = {};

mainController.mainPage = function(req, res) {

    if (!req.session.user) {
        console.log('>>noSession: ');
        res.redirect('/login');
    } else {
        console.log('>>session: ');
        console.log(req.session.user);
        res.sendfile('./public/main.html');
    }
};

mainController.loginPage = function(req, res) {
    req.session.destroy();
    res.sendfile('./public/login.html');
};

mainController.registerPage = function(req, res) {
    req.session.destroy();
    res.sendfile('./public/register.html');
};

mainController.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/');
};

mainController.login = function(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    async.waterfall([
        function(callback) {
            User.findOne({
                email: email
            }, callback);
        },
        function(user, callback) {//1st arg: user or null
            if (user) {
                if (user.checkPassword(password)) {
                    callback(null, user);
                } else {
                    callback("Wrong password");
                }
            } else {
                callback("Unregistered user");
            }
        }
    ], function(err, user) {
        if (err) {
            console.log('>> ' + err);
            res.redirect('/login');
        } else {
            req.session.user = user._id;
            res.redirect('/');
        }
    });
};

mainController.register = function(req, res, next) {
    let email = req.body.email;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let password = req.body.password;
    let isManager = (req.body.isManager)? true : false;

    async.waterfall([
        function(callback) {
            User.findOne({
                email: email
            }, callback);
        },
        function(user, callback) {
            if (user) {
                callback("User with this email already registered");
            } else {
                let user = new User({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    isManager: isManager
                });
                user.save(function(err) {
                    if (err) {
                        return next(err);
                    } else {
                        console.log('>>New User: ');
                        console.log(user);
                        callback(null, user);
                    }
                });
            }
        }
    ], function(err, user) {
        if (err) {
            console.log('>> ' + err);
            res.redirect('/register');
        } else {
            req.session.user = user._id;
            res.redirect('/');
        }
    });

};

module.exports = mainController;
