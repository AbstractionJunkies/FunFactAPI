/* globals module, require */
'use strict';

module.exports = (models) => {
    const { User } = models;

    return {
        getUserById(userId) {
            return new Promise((resolve, reject) => {
                User.findOne({ _id: userId }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            });
        },
        getByEmail(email) {
            return new Promise((resolve, reject) => {
                User.findOne({ email }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            });
        },
        getByUsername(username) {
            return new Promise((resolve, reject) => {
                User.findOne({ username: username }, (err, user) => {

                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            });
        },
        createUser(username, passHash, email, salt) {
            let user = new User({
                username: username,
                passHash: passHash,
                email: email,
                salt: salt,
                roles: ['regular']
            });

            return new Promise((resolve, reject) => {
                user.save((err) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            });
        },
        addFactToFavorites(username, fact) {
            this.getByUsername(username)
                .then(user => {
                    user.favoriteFacts.push(fact);
                    user.save();
                });
        },
        getUserFavorites(username) {
            return new Promise((resolve, reject) => {
                this.getByUsername(username)
                    .then(result => {
                        resolve(result.favoriteFacts);
                    });
            });
        },
        uploadAvatar(username, img) {
            this.getByUsername(username)
                .then(user => {
                    user.avatar = img;
                    user.save();
                });
        },
        getAvatar(username) {
            return new Promise((resolve, reject) => {
                this.getByUsername(username)
                    .then(result => {
                        resolve(result.avatar);
                    });
            });
        }
    };
};