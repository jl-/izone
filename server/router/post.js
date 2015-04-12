;
'use strict';

var config = require('../configs/config');
var jwt = require('express-jwt');
var router = require('express').Router();
var Category = require('../apis/category');
var Post = require('../apis/post');
var qiniu = require('../apis/qiniu');

router.param('postId',function(req,res,next,postId){
    req.postId = postId;
    next();
});


router.route('/uptoken')
    .get(function(req,res){
        var policy = {};
        return res.status(200).send({
            uptoken: qiniu.getUploadToken(policy)
        });
    });

router.route('/')
    .get(function(req, res) {
        var data = {};
        data.conditions = {};
        data.fields = {};
        data.opts = {};
        data.population = true;

        data.opts.limit = req.query.limit || config.app.post.PER_PAGE;
        if(req.query.page){
            data.opts.skip = (req.query.page - 1) * config.app.post.PER_PAGE;
        }

        // TODO: support search
        var queryFields = Object.keys(req.query || {});
        queryFields.forEach(function(field){
            if(field !== 'page' && field !== 'limit')
            data.conditions[field] = req.query[field];
        });

        console.log(data);

        Post.find(data,function(err,result){
            return res.status(200).send(result);
        });
    })
    .post(jwt({
        secret: config.auth.secretToken
    }), function(req, res) {
        console.log(req.body);
        Post.create(req.body,function(err,post){
            return post ? res.status(201).send(post) : res.status(400).send(err || {});
        });
    });

router.route('/:postId')
    .put(jwt({
        secret: config.auth.secretToken
    }),function(req,res){
        req.body.postId = req.postId;
        Post.update(req.body,function(err,post){
            return post ? res.status(200).send(post) : res.status(400).send(err || {});
        });
    })
    .delete(jwt({
        secret: config.auth.secretToken
    }),function(req,res){
        var data = {
            categoryId: req.body.categoryId || req.query.categoryId,
            postId: req.postId
        };
        console.log(data);
       Post.delete(data,function(err,post){
            return post ? res.status(200).send(post) : res.status(400).send(err || {});
       }); 
    });


module.exports = router;