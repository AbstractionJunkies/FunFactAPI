'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');


module.exports = (config, app) => {
    // server cliend folder bower etc..
    app.use(express.static(path.join(config.rootPath, 'client')));
    //needed to server index.html for angular
    app.use(express.static(path.join(config.rootPath, 'client/dist')));

    app.use(cookieParser());
    app.use(session({
        secret: 'djagascript',
        cookie: { maxAge: 60 * 60 * 60 * 1000 },
        rolling: true,
        resave: true,
        saveUninitialized: false
    }));

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });
    require('./passport')(app);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    
};