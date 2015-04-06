;'use strict';

var mongoose = require('mongoose');
var config = require('../configs/config');
var Schema = mongoose.Schema;


var genderEnum = ['female,male','private'];

var Profile = new Schema({
    name: {type:String,trim: true},
    birth: Date,
    city: {type: String, trim: true},
    avatar: { type: String, default: config.server.domain + '/statics/images/default-avatar.jpeg' },
    gender: {type: String, enum: genderEnum},
    signature: {type:String, trim: true},
    edu:[{
        school: String,
        major: {type: String, trim: true},
        startYear: Number,
        endYear: Number,
        description: {type:String,trim: true}
    }],
    experiences:[{
        company: String,
        title: String,
        location: String,
        startYear: Number,
        startMonth: Number,
        endYear: Number,
        endMonth: Number,
        description: {type:String,trim: true}
    }],
    projects:[{
        name: String,
        title: String,
        duty: String,
        thumbnail: String,
        homepage: String,
        startYear: Number,
        startMonth: Number,
        endYear: Number,
        endMonth: Number,
        description: {type: String, trim: true},
        skills:[{type: String}]
    }],
    awards:[{
        name: String,
        date: Date,
        description: {type: String, trim: true}
    }],
    interests:[{

    }],
    skills:[{
        name: String,
        state:{type:String,trim: true},
        isMajor: {type: Boolean, default: true},
        relatives: [{type: String}],
        description: {type: String, trim: true}
    }],
    contact:{
        email: {type: String},
        phone:{type:String, match: /^1\d{10}$/},
        wechat: {type: String},
        twitter: {type: String, trim: true},
        gplus: {type: String, trim: true},
        facebook: {type: String, trim: true},
        github:{type: String, trim: true}
    },
    characters:[{type: String,trim: true}]
});





module.exports = mongoose.model('Profile',Profile);