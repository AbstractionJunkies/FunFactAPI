'use strict';

const router = require('express').Router();
const passport = require('passport');
const auth = require('../config/auth');

module.exports = function ({ app, controllers }) {
    const home = controllers.home;

    router
        .get('/', home.getHome)
        .get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
            console.log(req.isAuthenticated());
            res.send("here" + req.user._id);
        });
    app.use(router);
};