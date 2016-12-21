'use strict';

const passport = require('passport');
const data = require('../../data')();

passport.serializeUser((user, done) => {
    if (user) {
        return done(null, user.id);
    }

    return done(null, false);
});

passport.deserializeUser((userId, done) => {
    data
        .getById(userId)
        .then(user => done(null, user || false))
        .catch(error => done(error, false));
});

require('./local-strategy')(passport, data);

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
};