'use strict';

module.exports = function () {
    return {
        getHome(req, res) {
            res.json({ data: 'data' });
        }
    };
};