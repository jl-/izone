;
'use strict';

var Category = require('../models/category');
var Post = require('../models/post');
var ERROR = require('../configs/ERROR');

exports.list = function(data, callback) {

};

exports.create = function(data, callback) {
    var error = {};
    error.status = false;
    var post = new Post({
        title: data.title || 'post title',
        content: data.content || 'post content'
    });
    post.save(function(err, p) {
        if (!p || err) {
            error.msg = 'failed to create post';
            return callback(err || error);
        }
        Category.findById(data.categoryId)
            .exec(function(err, category) {
                if (!category || err) {
                    error.msg = 'category id invalid, category not exists';
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
    if (!data || !data.postId) {
        return callback({
            msg: 'postId is required'
        });
    }
    Post.findByIdAndUpdate(data.postId, {
        title: data.title,
        content: data.content,
        tags: data.tags
    }, callback);
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
exports.view = function(callback){

};