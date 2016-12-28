'use strict';

module.exports = function ({data, encryption}) {
    return {
        _validateToken(req, res) {
            let token = req.headers.authorization;
            if (!token) {
                return res.statu(401).json({
                    success: false,
                    message: 'You must be loged in order to vote'
                });
            }
            token = token.substring(1, token.length - 1);
            console.log(token);
            let user = encryption.deciferToken(token);
            console.log(user);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'You must be loged in order to vote'
                });
            }
        },
        uploadFact(req, res, img) {
            this._validateToken(req, res);

            let uploader = req.body.username;
            let title = req.body.title;
            let category = req.body.category;


            data.createFact({title, uploader, img, category})
                .then(fact => {
                    res.json({isUploaded: true});
                });

        },
        getAllFacts(req, res) {
            let page = req.query.page;
            data.getAllFacts(page).then(result => {
                res.status(200).json(result);
            });
        },
        getFactById(req, res) {
            let id = req.params.id;
            data.getFactById(id).then(result => {
                res.status(200).json(result);
            });
        },
        getFactComments(req, res) {
            let id = req.params.id;

            data.getFactComments(id)
                .then(result => res.status(200).json(result));
        },
        addComment(req, res) {
            let id = req.params.id;
            let comment = req.body.comment;


            data.addComment(id, comment);
            res.json(comment);
        },
        rateFact(req, res) {
            console.log(req.user);
            let id = req.params.id;
            let user = req.user;

            if (!req.body.vote) {
                res.status(400).json({
                    succes: false,
                    message: 'You must provide rating value!'
                });
                return;
            }

            let vote = +req.body.vote;

            if (vote < 0 || vote > 5) {
                res.send(400).json({
                    success: false,
                    message: 'Vote value must be bewteen 1 and 5'
                });

                return;
            }

            data.rateFact(id, user.username, vote)
                .then(fact => {
                    res.status(201)
                        .json({
                            succes: true,
                            message: 'Vote has been added successfuly',
                            rate: fact.rating
                        });
                });

        },
        voteForKnowledge(req, res){
            let vote = req.body.vote;
            let id = req.params.id;
            if (vote === 'yes') {
                data.voteYes(id)
                    .then(result => {
                        res.status(200).json(result);
                    })
            } else {
                data.voteNo(id);
            }

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
            let username = req.body.username;

            data.uploadAvatar(username, img);
        },
        getAvatar(req, res) {
            let username = req.params.username;

            data.getAvatar(username)
                .then(result => res.status(200).json(result));
        }
    };
};







