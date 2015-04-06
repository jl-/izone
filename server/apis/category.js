;
'use strict';
var Category = require('../models/category');
var Post = require('../models/post');
var ERROR = require('../configs/ERROR');

exports.list = function(data, callback) {
    var options = {};
    if (data.skip) {
        options.skip = data.skip;
    }
    if (data.limit) {
        options.limit = data.limit;
    }
    var query = Category.find(null, null, options);
    if (data.population) {
        query.populate({
            path: 'posts',
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
    var error = {};
    error.status = false;
    if (!data.name) {
        error.msg = ERROR.CATEGORY_NAME_REQUIRED;
        return callback(error);
    }
    var category = new Category({
        name: data.name
    });
    category.save(callback);
};
exports.delete = function(data, callback) {
    Category.findById(data.categoryId, function(err, category) {
        category.remove(callback);
    });
};
exports.getOne = function(data, callback) {
    Category.findById(data.categoryId)
        .populate({
            path: 'posts',
            options: {}
        }).exec(callback);
};
exports.rename = function(data, callback) {
    var error = {};
    error.status = false;
    error.msg = (!data || !data.categoryId) ? 'categoryId is required.' : undefined;
    error.msg = error.msg || (!data.name ? 'category name is required.' : undefined);
    if (error.msg) {
        return callback(error);
    }
    Category.findByIdAndUpdate(data.categoryId, {
        name: data.name
    }, callback);
};