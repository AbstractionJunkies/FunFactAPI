'use strict';
const multer = require('multer');
const path = require('path');
const router = require('express').Router();

module.exports = function ({ app, controllers }) {
    const facts = controllers.facts;

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {

            cb(null, path.join(__dirname, '../../public/images/fact-images/'));
        },
        filename: function (req, file, cb) {
            
            cb(null, Date.now() + file.originalname);
        }
    });

    const upload = multer({
        storage
    });

    router
        .post('/upload', upload.any(), facts.uploadFact);

    app.use('/facts', router);
};