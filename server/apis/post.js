;
'use strict';

var Category = require('../models/category');
var Post = require('../models/post');
var ERROR = require('../configs/ERROR');

exports.find = function(data, callback) {
    data = data  || {};
    var conditions = data.conditions || {};
    var fields = data.fields || {};
    var opts = data.opts || {};
    opts.sort = {
        createdAt: -1
    };

    var query = Post.find(conditions,fields,opts);

    data.population = true;

    if (data.population) {
        query.populate({
            path: 'category',
            select: 'name _id createdAt',
            options: {
                sort:{
                    createdAt: -1
                }
            }
        });
    }
    query.exec(callback);
};

exports.create = function(data, callback) {
    data = data || {};
    var error = {};
    error.status = false;

    Category.findById(data.categoryId)
        .exec(function(err,category){
            if(err || !category) {
                error.msg = 'category id invalid.';
                return callback(error);
            }

            var date = new Date();

            var post = new Post({
                title: data.title || 'post title',
                content: data.content || 'post content',
                category: category,
                date: date.toJSON().split('T')[0],
                hash: 'post-title',
                createdAt: date
            });
            post.save(function(err, p) {
                if (!p || err) {
                    error.msg = 'failed to create post';
                    return callback(err || error);
                }
                category.posts.unshift(p);
                // return created post
                category.save(function(err, c) {
                    return callback(err, p);
                });
            });

        });
};


exports.update = function(data, callback) {
    if (!data || !data.postId || !data.title) {
        return callback({
            msg: 'postId is required'
        });
    }
    console.log(data);
    Post.findById(data.postId,function(err,post){
        if(err || !post) {
            return res.status(200).send({
               status: false,
                err: err
            });
        }
        post.title = data.title;
        post.content = data.content;
        post.tags = data.tags || [];
        post.hash = (data.hash || data.title).replace(/ /g,'-');
        post.save(callback);
    });
};
exports.delete = function(data,callback){
    var error = {};
    error.status  = false;
    error.msg = (!data || ! data.categoryId) ? 'categoryId is required' : undefined;
    error.msg = error.msg || (!data.postId ? 'postId is required' : undefined);
    if(error.msg){
        return callback(error);
    }

    Post.findById(data.postId, function(err, post) {
        post.remove(function(err,p){
            if(err){
                return callback(err);
            }
            Category.findById(data.categoryId, function(err, category) {
                if(err || ! category){
                    return callback(err || error);
                }
                category.posts.pull(data.postId);
                category.save(function(err){
                    callback(err,post);
                });
            });
        });
    });
};
