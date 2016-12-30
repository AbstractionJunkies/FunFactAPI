/* globals module, require */
'use strict';

module.exports = (models) => {
    const { User } = models;

    return {
        getAllUsers() {
            return new Promise((resolve, reject) => {
                User.find({}, (err, user) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(user);
                });
            });
        }
    };
};