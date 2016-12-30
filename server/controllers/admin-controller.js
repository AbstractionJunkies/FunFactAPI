'use strict';
const jwt = require('jsonwebtoken');

module.exports = function ({data, encryption, passport}) {
    return {
        getAllusers(req, res) {

            data.getAllUsers()
                .then(users => {
                    res.status(200).json({
                        success: true,
                        data: users
                    });
                });
        }
    };
};