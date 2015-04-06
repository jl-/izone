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


// qiniu uptoken
router.route('/uptoken')
    .get(function(req,res){
        var policy = {};
        return res.status(200).send({
            uptoken: qiniu.getUploadToken(policy)
        });
    });


router.route('/')
    .get(function(req, res) {
        req.query.categoryId = req.categoryId;
        Category.getOne(req.query,function(err,category){
            return category ? res.status(200).send(category) : res.status(404).send(err || {});
        });
    })
    .post(jwt({
        secret: config.auth.secretToken
    }), function(req, res) {
        req.body.categoryId = req.categoryId;
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
            categoryId: req.categoryId,
            postId: req.postId
        };
       Post.delete(data,function(err,post){
            return post ? res.status(200).send(post) : res.status(400).send(err || {});
       }); 
    });

router.route('/:postId/view')
    .put(function(req,res){

    });

module.exports = router;