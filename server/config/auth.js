const passport = require('passport');

module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.status(401).json({
                succes: false,
                message: 'Please log in '
            });
        }
    }

};