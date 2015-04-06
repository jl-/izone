;
'use strict';

var config = require('../configs/config');
var jwt = require('express-jwt');
var router = require('express').Router();
var Category = require('../apis/category');

router.param('categoryId', function(req, res, next, categoryId) {
    req.categoryId = categoryId;
    next();
});
router.route('/')
    .get(function(req, res) {
        Category.list(req.query, function(err, categories) {
            return categories ? res.status(200).send(categories) : res.status(404).send([]);
        });
    })
    .post(jwt({
        secret: config.auth.secretToken
    }), function(req, res) {
        Category.create(req.body, function(err, category) {
            return category ? res.status(201).send(category) : res.status(404).send(err || {});
        });
    });

router.route('/:categoryId')
    .get(function(req, res) {
        var query = {
            categoryId: req.categoryId
        };
        Category.getOne(query, function(err, category) {
            return category ? res.status(200).send(category) : res.status(404).send(err || {});
        });
    })
    .put(jwt({
        secret: config.auth.secretToken
    }), function(req, res) {
        req.body.categoryId = req.categoryId;
        Category.rename(req.body,function(err,category){
            return category ? res.status(200).send(category) : res.status(400).send(err || {});
        }) ;
    })
    .delete(jwt({
        secret: config.auth.secretToken
    }), function(req, res) {
        var query = {
            categoryId: req.categoryId
        };
        Category.delete(query, function(err, category) {
            return category ? res.status(200).send({
                status: true
            }) : res.status(400).send({
                status: false
            });
        });
    });

module.exports = router;