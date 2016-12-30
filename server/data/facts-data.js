/* globals module, require */
'use strict';
function calculateRate(usersRated) {

    let allrate = 0;
    for (let u of usersRated) {
        allrate += +u;
    }

    return allrate;
}


module.exports = (models) => {
    const {Fact} = models;

    return {
        getAllFacts(page) {
            page = page || 0;
            const size = 5;
            return new Promise((resolve, reject) => {
                let query = Fact.find({ isDeleted: false })
                    .skip(page * size)
                    .limit(size);

                resolve(query);
            });
        },
        getAllFactsWithoutPaging() {
            return new Promise((resolve, reject) => {
                let query = Fact.find({ isDeleted: false });

                resolve(query);
            });
        },
        getFactById(factId) {
            return new Promise((resolve, reject) => {
                Fact.findOne({ _id: factId, isDeleted: false }, (err, fact) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(fact);
                });
            });
        },
        deleteFactById(factId) {
            return new Promise((resolve, reject) => {
                this.getFactById(factId)
                    .then(fact => {
                        if (!fact) {
                            return reject(fact);
                        }

                        fact.isDeleted = true;
                        fact.save();

                        return resolve(fact);
                    });
            });
        },
        getFactsByUsername(username) {
            return new Promise((resolve, reject) => {
                Fact.find({ uploader: username, isDeleted: false }, (err, fact) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(fact);
                });
            });
        },
        getFactByCategory(category) {
            return new Promise((resolve, reject) => {
                Fact.find({ category: category, isDeleted: false }, (err, fact) => {
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
        createFact({title, uploader, img, category}) {

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

                    if (indexOfUserLikedFact < 0) {
                        foundFact.usersRated.push({
                            username: username,
                            vote: rate
                        });

                    } else {
                        foundFact.usersRated[indexOfUserLikedFact] = {
                            username: username,
                            vote: rate
                        };

                        // foundFact.rating = (foundFact.usersRated.reduce((a, b) => a.vote + b.vote, 0) - oldVote) / foundFact.usersRated.length;//(foundFact.rating + rate) / foundFact.usersRated.length;
                    }

                    let allrate = 0;
                    for (let rate of foundFact.usersRated) {
                        allrate += rate.vote;
                    }

                    foundFact.rating = allrate / foundFact.usersRated.length;
                    foundFact.save();
                    return foundFact;
                });
        },
        voteYes(factId) {
            return this.getFactById(factId)
                .then(foundFact => {
                    foundFact.knowledgeCount = {
                        yes: foundFact.knowledgeCount.yes + 1,
                        no: foundFact.knowledgeCount.no
                    };
                    foundFact.save();
                    return foundFact;
                });
        },
        voteNo(factId) {
            return this.getFactById(factId)
                .then(foundFact => {
                    foundFact.knowledgeCount = {
                        yes: foundFact.knowledgeCount.yes,
                        no: foundFact.knowledgeCount.no + 1
                    };
                    foundFact.save();
                    return foundFact;
                });

        }
    };
};