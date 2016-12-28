'use strict';

const router = require('express').Router();
const passport = require('passport');

module.exports = function ({app, controllers}) {
    const home = controllers.home;

    router
        .get('/home', home.getHome);

    app.use(router);
};