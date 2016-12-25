'use strict';
const jwt = require('jsonwebtoken');

module.exports = function ({data, encryption, passport}) {
    return {
        login(req, res, next) {
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid username or password'
                    });
                }
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }

                    let token = jwt.sign(user, 'magicstring', {
                        expiresIn: 7200 // 2 hours in seconds
                    });
                    return res.status(200).json({
                        success: true,
                        message: `User ${user.username} logged in succesfully`,
                        token: 'JWT ' + token
                    });
                });
            })(req, res, next);

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
                // need to remove 'JWT ' in order to decode it ... (i know it sucks!)
                let decoded = jwt.decode(token.split(' ')[1], 'magicstring');
                // console.log(decoded);

                const userInfo = decoded._doc;
                let user = {
                    username: userInfo.username
                    // add more info if you need it
                };

                res.status(200).json(user);
            } else {
                res.status(401).json({
                    success: false,
                    message: 'Please provide token'
                });
            }
        }
    };
};