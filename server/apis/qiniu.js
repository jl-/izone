/**
 *
 * Created by jl on 2/7/15.
 */
var configs = require('../configs/config');
var qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = configs.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = configs.qiniu.SECRET_KEY;


exports.getUploadToken = function(policy,bucket){
    policy = policy || {};
    var putPolicy = new qiniu.rs.PutPolicy(bucket || configs.qiniu.buckets.IZONE);

    // callbackUrl callbackBody


    for(var field in policy){
        if(policy.hasOwnProperty(field)){
            putPolicy[field] = policy[field];
        }
    }
    putPolicy.saveKey = 'false';
    return putPolicy.token();
};


exports.qiniuCallbackValidation = function(req,res,next){
    var authorization = req.header('Authorization') || '';
    var valid = authorization.indexOf('QBox ') === 0;
    if(authorization.indexOf('QBox ') === 0){
        var auth = authorization.substr(5).split(':');
        if(auth[0] === configs.qiniu.ACCESS_KEY){
            return next();
        }
    }
    return res.status(404).send({
        message: 'invalid qiniu callback'
    });
};
exports.rs = qiniu.rs;

