;'use strict';

var mongoose = require('mongoose'),
    config = require('../configs/config'),
    Schema = mongoose.Schema;

var Portfolio = new Schema({
    title: {type: String, trim: true},
    key: {type: String, required: true, trim: true}, //qiniu image key
    createdAt: {type: Date},
    link: {type: String},
    description:{type:String,trim: true}
});





module.exports = mongoose.model('Portfolio',Portfolio);