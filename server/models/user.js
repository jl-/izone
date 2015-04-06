;'use strict';

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

// User Schema
// =========================
var User = new mongoose.Schema({
    email: {type: String, required: true, index: {unique: true}, trim: true},
    password: {type: String, required: true},
    createdAt:{type:Date,default:Date.now()}
});



//  encrypt password.
// ==================
User.pre('save',function(next){
    var user = this;
    // only hash the password if it has been modified(or is new)
    if(!user.isModified('password')){
        return next();
    }

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err){
            return next(err);
        }
        // hash the password along with the salt
        bcrypt.hash(user.password,salt,function(err,hash){
            if(err){
                return next(err);
            }
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });

});


User.methods.comparePassword = function(candidatePassword,cb){
    bcrypt.compare( candidatePassword, this.password, function(err,isMatch){
        if(err){
            return cb(err);
        }
        cb(null,isMatch);
    });
};



// User Model
// ===========================
module.exports = mongoose.model('User',User);