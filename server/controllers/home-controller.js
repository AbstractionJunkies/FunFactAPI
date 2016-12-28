'use strict';

module.exports = function ({data}) {
    return {
        getHome(req, res) {
            let page = req.query.page;
            data.getAllFacts(page)
                .then(result => {
                    let randomFact = result[Math.floor(Math.random() * Object.keys(result).length)];
                    res.status(200).json(randomFact);
                });
        }
    };
};