'use strict';
const multer = require('multer');
const path = require('path');
const router = require('express').Router();
const auth = require('../config/auth');

module.exports = function ({ app, controllers, passport }) {
    const userController = controllers.user;
    let img = '';

    const storageAvatar = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../../public/images/user-аvatar-images/'));
        },
        filename: function (req, file, cb) {
            img = Date.now() + file.originalname;
            cb(null, img);
        }
    });

    const uploadAvatar = multer({
        storage: storageAvatar
    });

    router
        .put('/user/:id', passport.authenticate('jwt', { session: false }), userController.updatePrivateInfo)
        .get('/user/:username/favorites', passport.authenticate('jwt', { session: false }), userController.getUserFavorites)
        .post('/user/:username/favorites', passport.authenticate('jwt', { session: false }), userController.addFactToFavorites)
        .get('/user/:username/avatar', passport.authenticate('jwt', { session: false }), userController.getAvatar)
        .post('/user/avatar', uploadAvatar.any(), (req, res) => {

            userController.uploadAvatar(req, res, img);
        });

    app.use('/api/users', router);
};