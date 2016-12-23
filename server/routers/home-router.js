'use strict';

const router = require('express').Router();
const passport = require('passport');

module.exports = function ({ app, controllers }) {
    const home = controllers.home;

    router
        .get('/', home.getHome)
        .get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
            res.send("here" + req.user._id);
        });

    app.use(router);
};