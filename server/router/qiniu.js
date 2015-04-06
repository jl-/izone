'use strict';

var config = require('../configs/config');
var router = require('express').Router();
var qiniu = require('../apis/qiniu');


router.route('/token')
    .get(function(req,res){
        var policy = {};
        return res.status(200).send({
           uptoken: qiniu.getUploadToken(policy)
        });
    });


module.exports = router;
