;
'use strict';

var config = require('./config');
var db = require('./db');
var User = require('../models/user');
var Profile = require('../models/profile');


// init
module.exports = function init() {
    db.start();

    User.findOne()
        .exec(function(err, user) {
            if (user) {
                return;
            }
            var user = new User({
                email: config.account.email,
                password: config.account.password
            });
            user.save(function(err,u){
                if(u){
                    var profile = new Profile();
                    profile.save();
                }
            });
        });

};