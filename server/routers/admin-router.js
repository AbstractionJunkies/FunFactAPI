/*globals */
'use strict';

const passport = require('passport');
const router = require('express').Router();
const auth = require('../config/auth');

module.exports = function ({  app, controllers }) {
    const adminController = controllers.admin;

    router
        .get('/users/all', auth.isAuthenticated(), auth.isInRole('admin'), adminController.getAllusers);

    app.use('/api/admin', router);
};