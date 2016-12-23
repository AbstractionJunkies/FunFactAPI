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
    category: {
        type: String,
        required: true
    }
});

mongoose.model('Fact', factSchema);
module.exports = mongoose.model('Fact');