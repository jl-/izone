;
'use strict';

var config = require('../configs/config');
var jwt = require('express-jwt');
var Profile = require('../models/profile');
var router = require('express').Router();

var gm = require('gm');
var fs = require('fs');

router.route('/')
    .get(function(req, res) {
        Profile.findOne(function(err, profile) {
            return profile ? res.status(200).send(profile) : res.status(404).send(err || {});
        });
    })
    .put(jwt({
        secret: config.auth.secretToken
    }), function(req, res) {
        var id = req.body._id;
        delete req.body._id;
        Profile.findByIdAndUpdate(id, req.body, function(err, profile) {
            return profile ? res.status(200).send(profile) : res.status(404).send(err || {});
        });
    });

router.route('/avatar')
    .put(jwt({
        secret: config.auth.secretToken
    }), function(req, res) {
        for(var file in req.files){
            fs.rename( req.files[file].path, __dirname + '/../statics/images/' + req.files[file].name +'.jpeg' ,function(err){
                if(err){
                    return res.status(400).send({msg: err});
                }
                Profile.findById(req.body.profileId).exec(function(err,profile){
                    var avatar = profile.avatar.split('images/')[1];
                    Profile.findByIdAndUpdate(req.body.profileId, {
                        avatar: config.server.domain + '/statics/images/' + req.files[file].name + '.jpeg'
                    }, function(err, p) {
                        if(err){
                            return res.status(400).send({msg: err});
                        }
                        res.status(200).send({avatar: p.avatar});
                        fs.unlink(  __dirname + '/../statics/images/' + avatar, function(err){
                        });
                    });
                });
            });
        }
    });

module.exports = router;