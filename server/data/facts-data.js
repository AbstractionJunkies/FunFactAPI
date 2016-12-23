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
        getFactByUsername(username) {
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
        createFact({title, uploader, img, category}) {

            let fact = new Fact({
                title,
                uploader,
                img: 'http://localhost:1337/static/images/fact-images/' + img,
                category
            });

            return new Promise((resolve, reject) => {
                fact.save((err) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(fact);
                });
            });
        }
    };
};