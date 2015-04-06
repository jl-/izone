;
'use strict';

var router = require('express').Router();
var jwt = require('jsonwebtoken');
var validator = require('../utils/validator');
var User = require('../models/user');
var config = require('../configs/config');
var ERROR = require('../configs/ERROR');


router.route('/')
    .post(function(req, res) {
        var error = {};
        error.status = false;
        error.msg = req.body.email ? undefined : ERROR.EMAIL_REQUIRED;
        error.msg = error.msg || (req.body.password ? undefined : ERROR.PASSWORD_REQUIRED);
        error.msg = error.msg || (validator.isEmail(req.body.email) ? undefined : ERROR.EMAIL_INVALID);
        if (error.msg) {
            return res.status(400).send(error);
        }

        User.findOne({
            email: req.body.email
        }).exec(function(err, user) {
            if (!user) {
                error.msg = ERROR.ACCOUNT_NOT_EXISTS;
                return res.status(400).send(error);
            }
            user.comparePassword(req.body.password, function(err, isMatch) {
                error.msg = err ? 'terminal error' : undefined;
                error.msg = error.msg || (!isMatch ? ERROR.ACCOUNT_NOT_MATCH : undefined);
                if (error.msg) {
                    return res.status(400).send(error);
                } else {
                    // sign a jwt token.
                    var token = jwt.sign({
                        uid: user.id,
                        email: user.email
                    }, config.auth.secretToken, {
                        expiresInMinutes: config.auth.expiresInMinutes
                    });
                    return res.status(201).send({
                        status: true,
                        token: token
                    });
                }
            });

        });

    });



module.exports = router;