/*globals */
'use strict';

const passport = require('passport');
const router = require('express').Router();

module.exports = function ({  app, controllers }) {
    const authController = controllers.auth;

    router
        .post('/login', authController.login)
        .post('/register', authController.register)
        .post('/logout', authController.logout)
        .get('/getLoggedUser', passport.authenticate('jwt', { session: false }), authController.getLoggedUser);

    app.use('/api/auth', router);
};