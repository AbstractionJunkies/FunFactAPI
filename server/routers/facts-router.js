'use strict';
const multer = require('multer');
const path = require('path');
const router = require('express').Router();
const auth = require('../config/auth');

module.exports = function ({ app, controllers, passport }) {
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

    const storageAvatar = multer.diskStorage({
        destination: function (req, file, cb) {

            cb(null, path.join(__dirname, '../../public/images/user-аvatar-images/'));
        },
        filename: function (req, file, cb) {
            img = Date.now() + file.originalname;
            cb(null, img);
        }
    });

    const uploadFact = multer({
        storage: storageFact
    });

    const uploadAvatar = multer({
        storage: storageAvatar
    });

    router
        .post('/upload', uploadFact.any(), (req, res) => {
            facts.uploadFact(req, res, img);
        })
        .post('/fact/:id/comments', facts.addComment)
        .get('/fact/:id/comments', facts.getFactComments)
        .get('/fact/:id', facts.getFactById)
        .put('/fact/:id', passport.authenticate('jwt', { session: false }), facts.rateFact)
        .put('/fact/vote/:id', facts.voteForKnowledge)//TODO:Change  rate to vote
        .get('/all', facts.getAllFacts)
        .get('/user/:username/favorites', facts.getUserFavorites)
        .post('/user/:username/favorites', facts.addFactToFavorites)
        .get('/user/:username/avatar', facts.getAvatar)
        .post('/user/avatar', uploadAvatar.any(), (req, res) => {
            facts.uploadAvatar(req, res, img);
        });

    app.use('/facts', router);
};