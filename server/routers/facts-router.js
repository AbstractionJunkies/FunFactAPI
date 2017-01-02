'use strict';
const multer = require('multer');
const path = require('path');
const router = require('express').Router();

module.exports = function ({ app, controllers, passport, auth }) {
    const facts = controllers.facts;
    let img = '';
    const storageFact = multer.diskStorage({
        destination: function (req, file, cb) {

            cb(null, path.join(__dirname, '../../public/images/fact-images/'));
        },
        filename: function (req, file, cb) {

            img = Date.now() + file.originalname;
            cb(null, img);
        }
    });

    const uploadFact = multer({
        storage: storageFact
    });


    router
        .post('/upload', uploadFact.any(), (req, res) => {
            facts.uploadFact(req, res, img);
        })
        .post('/fact/:id/comments', auth.isAuthenticated(), auth.isBlocked(), facts.addComment)
        .get('/fact/:id/comments', facts.getFactComments)
        .get('/fact/:id', facts.getFactById)
        .put('/fact/:id', auth.isAuthenticated(), auth.isBlocked(), facts.rateFact)
        .put('/fact/vote/:id', facts.voteForKnowledge)//TODO:Change  rate to vote
        .get('/all', facts.getAllFacts);

    app.use('/facts', router);
};