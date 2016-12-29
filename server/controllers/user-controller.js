'use strict';
const jwt = require('jsonwebtoken');

module.exports = function ({data, encryption, passport}) {
    return {
        updatePrivateInfo(req, res) {
            res.send("good");
        },
        getUserFavorites(req, res) {
            let username = req.params.username;

            data.getUserFavorites(username)
                .then(result => res.status(200).json(result));
        },
        addFactToFavorites(req, res) {
            let username = req.params.username;
            let fact = req.body.fact;

            data.addFactToFavorites(username, fact);

        },
        uploadAvatar(req, res, img) {
            console.log(req.body);
            console.log(img);
            let username = req.body.username;

            data.uploadAvatar(username, img);

            res.status(200).send(img);
        },
        getAvatar(req, res) {
            let username = req.params.username;

            data.getAvatar(username)
                .then(result => res.status(200).json(result));
        }
    };
};