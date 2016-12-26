/* globals module, require */
'use strict';

module.exports = (models) => {
    const { Fact } = models;

    return {
        getAllFacts() {
            return new Promise((resolve, reject) => {
                Fact.find({}, (err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(data);
                });
            });
        },
        getFactById(factId) {
            return new Promise((resolve, reject) => {
                Fact.findOne({ _id: factId }, (err, fact) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(fact);
                });
            });
        },
        getFactsByUsername(username) {
            return new Promise((resolve, reject) => {
                Fact.find({ uploader: username }, (err, fact) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(fact);
                });
            });
        },
        getFactByCategory(category) {
            return new Promise((resolve, reject) => {
                Fact.find({ category }, (err, fact) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(fact);
                });
            });
        },
        addComment(factId, comment) {
            this.getFactById(factId)
                .then(fact => {
                    fact.comments.push(comment);
                    fact.save();
                });
        },
        getFactComments(factId) {
            return new Promise((resolve, reject) => {
                this.getFactById(factId).then(
                    result => resolve(result.comments)
                );
            });
        },
        createFact({ title, uploader, img, category }) {

            let usersRated = [];
            let fact = new Fact({
                title,
                uploader,
                img: 'http://localhost:1337/static/images/fact-images/' + img,
                category,
                usersRated
            });

            return new Promise((resolve, reject) => {
                fact.save((err) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(fact);
                });
            });
        },
        rateFact(factId, username, rate) {
            return this.getFactById(factId)
                .then(foundFact => {
                    rate = +rate;

                    let indexOfUserLikedFact = -1;
                    for (let i = 0, len = foundFact.usersRated.length; i < len; i += 1) {
                        let userRated = foundFact.usersRated[i];
                        if (userRated.username === username) {
                            indexOfUserLikedFact = i;
                            break;
                        }
                    }

                    console.log(indexOfUserLikedFact);
                    if (indexOfUserLikedFact < 0) {
                        console.log('new like ', rate);
                        foundFact.usersRated.push({
                            username: username,
                            vote: rate
                        });

                        foundFact.rating = (foundFact.rating + rate) / foundFact.usersRated.length;

                    } else {
                        let oldVote = +foundFact.usersRated[indexOfUserLikedFact].vote;
                        console.log('alreadyLiked');
                        console.log('old value ' + oldVote);
                        foundFact.usersRated[indexOfUserLikedFact] = {
                            username: username,
                            vote: rate
                        };

                        foundFact.rating = (foundFact.rating + rate - oldVote) / foundFact.usersRated.length;

                    }

                    foundFact.save();
                    return foundFact;
                });
        }
    };
};