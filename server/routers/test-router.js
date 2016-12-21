'use strict';

const router = require('express').Router();

module.exports = function ({ app, controllers }) {
    const test = controllers.test;

    router
        .get('/test', test.getTest);

    app.use('/api', router);
};