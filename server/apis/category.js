;
'use strict';
var Category = require('../models/category');
var Post = require('../models/post');
var ERROR = require('../configs/ERROR');

exports.list = function(data, callback) {
    data = data || {};
    var conditions = data.conditions || {};
    var fields = data.fields || {};
    var opts = data.opts ||{};
    var query = Category.find(conditions, fields, opts);
    if (data.population) {
        query.populate({
            path: 'posts',
            options: {
                sort:{
                    createdAt: -1
                }
            },
            select: 'title createdAt date hash' + (data.full ? ' content' : '') // data.full => populated with post content
        });
    }
    query.exec(callback);
};

exports.create = function(data, callback) {
    var error = {};
    error.status = false;

    data = data || {};
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
    data = data || {};
    Category.findById(data.categoryId, function(err, category) {
        category.remove(callback);
    });
};
exports.getOne = function(data, callback) {
    data = data || {};
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