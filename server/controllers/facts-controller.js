'use strict';

module.exports = function ({data, encryption}) {
    return {
        uploadFact(req, res, img) {
            console.log('uploaded! must be saved to the user and facts data!');
            let uploader = req.body.username;
            let title = req.body.title;
            let category = req.body.category;

            data.createFact({ title, uploader, img, category });

            res.json({ isUploaded: true });
        },
        getAllFacts(req, res) {
            data.getAllFacts().then(result => {
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
            let id = req.params.id;
            let token = req.headers.authorization;
           
            let user = encryption.deciferToken(token);

            if (!req.body.vote) {
                res.status(400).json({
                    succes: false,
                    message: 'You must provide rating value!'
                });
                return;
            }

            let vote = +req.body.vote;

            if (!user) {
                res.send(401).json({
                    success: false,
                    message: 'You must be loged in order to vote'
                });

                return;
            }

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
                            message: 'Vote has been added successfuly'
                        });
                });

        }
    };
};







