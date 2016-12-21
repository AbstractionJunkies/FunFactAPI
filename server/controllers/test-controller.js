'use strict';

module.exports = function () {
    return {
        getTest(req, res) {
            console.log('ooo');
            res.json({ 'pesho': 'tragvai' }); 
        }
    };
};
