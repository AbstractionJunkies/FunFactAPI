'use strict';

module.exports = function () {
    return {
        getHome(req, res) {
            console.log(req.user);
            res.json({ data: 'data' });
        }
    };
};