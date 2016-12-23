const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../../models/user-model');

module.exports = (passport, data, config) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret;

    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {

        // If you tell me why this doesn't work..
        // data.getUserById(jwt_payload.id)
        //     .then(user => {
        //         console.log(user);
        //         if (user) {
        //             done(null, user);
        //         } else {
        //             done(null, false);
        //         }
        //     });
        User.findOne({ id: jwt_payload.id }, function (err, user) {
            if (err) {
                return done(err, false);
            }

            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};