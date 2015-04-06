;'use strict';

var mongoose = require('mongoose'),
    config = require('./config');



mongoose.connection.on('connecting',function(ref){
    console.log('connecting to mongodb: ' + config.db.connectionUrl );
});

mongoose.connection.on('connected',function(ref){
    console.log('connected to mongodb: '+ config.db.connectionUrl);
});

mongoose.connection.on('close',function(){
    console.log('mongodb was successfully closed.');
});

mongoose.connection.on('error',function(err){
    console.log('failed to connect to mongodb.');
    console.log(err);
    process.exit(1);
});

process.on('SIGINT',function(){
    mongoose.connection.close(function(){
        console.log('Mongoose connection isDisconnected through app termination.');
        process.exit(0);
    });
});

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  process.exit(0);
});


exports.start = function(){
    mongoose.connect(config.db.connectionUrl,config.db.options);
};

