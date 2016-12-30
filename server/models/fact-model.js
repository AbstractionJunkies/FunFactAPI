/* globals module, require */

'use strict';

const mongoose = require('mongoose');

const factSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    uploader: {
        type: String,
        required: true
    },
    comments: {
        type: [{}]
    },
    rating: {
        type: Number,
        default: 0
    },
    usersRated: {
        type: [{
            username: String,
            vote: Number
        }]
    },
    category: {
        type: String,
        required: true
    },
    knowledgeCount: {
        type: {
            yes: Number,
            no: Number
        },
        default: {
            yes: 0,
            no: 0
        }
    },
    isDeleted: {
        type: Boolean,
        require: true,
        default: false
    }
});

mongoose.model('Fact', factSchema);
module.exports = mongoose.model('Fact');