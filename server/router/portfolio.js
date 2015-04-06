;
'use strict';

var config = require('../configs/config');
var jwt = require('express-jwt');
var Portfolio = require('../models/portfolio');
var router = require('express').Router();
var qiniu = require('../apis/qiniu');


router.param('portfolioId',function(req,res,next,portfolioId){
    req.portfolioId = portfolioId;
    next();
});

// qiniu uptoken
router.route('/uptoken')
    .get(function(req,res){
        var policy = {};
        //policy.callbackUrl = 'http://lab.jlxy.cz';
        policy.callbackUrl = config.server.domain + '/portfolio';
        policy.callbackBody = 'bucket=$(bucket)&key=$(key)&title=$(x:title)&link=$(x:link)&description=$(x:description)';
        return res.status(200).send({
            uptoken: qiniu.getUploadToken(policy)
        });
    });

router.route('/')
    .get(function(req, res) {
        Portfolio.find().exec(function(err,portfolio){
            return err ? res.status(400).send([]) : res.status(200).send(portfolio || []);
        });
    })
    .post(qiniu.qiniuCallbackValidation, function(req, res) {
        var portfolio = new Portfolio({
            title: req.body.title || '',
            key: req.body.key,
            link: req.body.link || '',
            description: req.body.description || ''
        });
        if(req.body.createdAt){
            portfolio.createdAt = req.body.createdAt;
        }
        portfolio.save(function(err,p){
            return err ? res.status(400).send({msg: err}) : res.status(201).send(p);
        });
    });

router.route('/:portfolioId')
    .put(jwt({secret: config.auth.secretToken}),function(req,res){
        delete req.body._id;
        delete req.body.status;
        Portfolio.findByIdAndUpdate(req.portfolioId, req.body, function(err, portfolio) {
            return portfolio ? res.status(200).send(portfolio) : res.status(404).send(err || {});
        });

    })
    .delete(jwt({secret: config.auth.secretToken}),function(req,res){
        Portfolio.findById(req.portfolioId,function(err,portfolio){
            if(err){
                return res.status(400).send({msg:err});
            }
            portfolio.remove(function(err,p){
                var client = new qiniu.rs.Client();
                client.remove(config.qiniu.buckets.IZONE, p.key);
                return err ? res.status(400).send({msg:err}) : res.status(200).send({
                    msg: 'delete succeed',
                    portfolio: p
                });
            });
        });
    });


module.exports = router;