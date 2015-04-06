;'use strict';

var config = require('./configs/config');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var router = require('./router');
var init = require('./configs/init');

// init
init();


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(multer({dest: __dirname + '/statics/uploads/'}));
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); 
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, If-Modified-Since');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.param('categoryId',function(req,res,next,categoryId){
    req.categoryId = categoryId;
    next();
});

// app router
// ================================
app.use(express.static(__dirname + '/../client'));
app.use('/statics',express.static(__dirname + '/statics'));
app.use('/session',router.session);
app.use('/profile',router.profile);
app.use('/categories',router.category);
app.use('/categories/:categoryId/posts',router.post);
app.use('/portfolio',router.portfolio);
app.use('/qiniu',router.qiniu);



app.listen(config.server.port, config.server.address);
console.log(config.server.address + ':' + config.server.port);
