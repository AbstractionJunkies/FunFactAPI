'use strict';
const jwt = require('jsonwebtoken');

module.exports = function ({data, encryption, passport}) {
    return {
        login(req, res, next) {
            // passport.authenticate('jwt', (err, user, info) => {
            //     if (err) {
            //         return next(err);
            //     }
            //     if (!user) {
            //         return res.status(401).json({
            //             success: false,
            //             message: 'Invalid username or password'
            //         });
            //     }
            //     req.logIn(user, function (err) {
            //         if (err) {
            //             return next(err);
            //         }

            //         let token = jwt.sign(user, 'magicstring', {
            //             expiresIn: 7200 // 2 hours in seconds
            //         });
            //         return res.status(200).json({
            //             success: true,
            //             message: `User ${user.username} logged in succesfully`,
            //             token: 'JWT ' + token
            //         });
            //     });
            // })(req, res, next);
            let username = req.body.username;
            let password = req.body.password;
            console.log(username, password);
            data.getByUsername(username)
                .then(user => {
                    console.log(user);
                    if (user === null || !user.authenticate(password)) {
                        res.status(401).json({
                            succes: 'false',
                            message: 'wrong username or password'
                        });
                        return;
                    }

                    let token = jwt.sign(user, 'magicstring', {
                        expiresIn: 7200 // 2 hours in seconds
                    });
                    res.status(200).json({
                        success: true,
                        message: `User ${user.username} logged in succesfully`,
                        token: 'JWT ' + token
                    });
                });

        },
        register(req, res) {
            if (req.body === null || typeof (req.body) === 'undefined') {
                res.status(401).json({ success: false, message: 'request body is empty' });
                return;
            }

            let username = req.body.username;
            let password = req.body.password.toString();
            let confirmedPassword = req.body.confirmedPassword.toString();
            let email = req.body.email;

            if (password.length < 4) {
                res.status(401).json({ success: false, message: 'Password too short' });
                return;
            }

            if (password !== confirmedPassword) {
                res.status(401).json({ success: false, message: 'Passwords do not match' });
                return;
            }

            let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!pattern.test(email)) {
                res.status(401).json({ success: false, message: 'Email is not valid' });
                return;
            }

            const salt = encryption.generateSalt();
            const passHash = encryption.generateHashedPassword(salt, password);

            Promise.all([data.getByUsername(username), data.getByEmail(email)])
                .then(([existringUser, existingEmail]) => {

                    if (existringUser) {
                        res.status(409).json({
                            success: false,
                            message: 'Username already exist!'
                        });
                        return;
                    } else if (existingEmail) {
                        res.status(409).json({
                            success: false,
                            message: 'Email already exist!'
                        });
                        return;
                    }

                    data.createUser(username, passHash, email, salt)
                        .then(() => {
                            res.status(201).json({
                                success: true,
                                message: `User ${username} created succesfully`
                            });
                        });
                });
        },
        logout(req, res) {
            req.logout();
            res.status(202).json({
                succes: true,
                message: `User ${req.body.username} is logged out succesfully`
            });
        },
        getLoggedUser(req, res) {
            const token = req.headers.authorization;
            if (token) {
                let user = encryption.deciferToken(token);

                if (user === null) {
                    console.log('tyk');
                    return res.status(401).json({
                        success: false,
                        message: 'Please provide a valid token'
                    });
                }

                return res.status(200).json(user);
            }

            return res.status(401).json({
                success: false,
                message: 'Please provide token'
            });

        }
    };
};