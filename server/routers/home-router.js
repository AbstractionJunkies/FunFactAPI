'use strict';

const router = require('express').Router();
const passport = require('passport');
const auth = require('../config/auth');

module.exports = function ({app, controllers}) {
    const home = controllers.home;

    router
        .get('/', home.getHome)
        .get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
            console.log(JSON.stringify(req.headers));
            res.send("here" + JSON.stringify(req.headers));
        });

    app.use(router);
};