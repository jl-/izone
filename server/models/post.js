;'use strict';

var mongoose = require('mongoose'),
    config = require('../configs/config'),
    Schema = mongoose.Schema;

var Post = new Schema({
    title: {type: String, required:true, trim: true},
    content: {type: String, required: true, trim: true},
    category: {type: Schema.Types.ObjectId, ref:'Category'},
    createdAt: {type: Date, default: Date.now()},
    tags:[{type:String,trim: true}],
    date: {type: String, required: true, trim: true}, // 2013-2-3
    hash: {type: String, required: true, trim: true}, // post-title
    view: {type: Number,default: 0}
});







module.exports = mongoose.model('Post',Post);