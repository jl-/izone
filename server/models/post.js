;'use strict';

var mongoose = require('mongoose'),
    config = require('../configs/config'),
    Schema = mongoose.Schema;

var Post = new Schema({
    title: {type: String, required:true, trim: true},
    content: {type: String, required: true, trim: true},
    createdAt: {type: Date, default: Date.now()},
    tags:[{type:String,trim: true}],
    view: {type: Number,default: 0}
});





module.exports = mongoose.model('Post',Post);