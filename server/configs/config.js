;'use strict';

exports.db = {
    connectionUrl: 'mongodb://localhost:27017/izone',
    options:{
        server:{
            socketOptions:{
                keepAlive: 1
            }
        } 
    }
};

exports.auth = {
    secretToken: 'secretToken',
    expiresInMinutes: 600
};

exports.regexps = {
    username: /^[\w.-]+$/,
    password: /^[^$]{6,20}$/
};
exports.account = {
    email: 'foo@bar', // your own email,
    password: 'password' // password
};

//======[REQUIRED*] config for qiniu
exports.qiniu = {
    ACCESS_KEY: 'your qiniu access_key',
    SECRET_KEY: 'your qiniu secret_key',
    buckets: {
        IZONE: 'i-zone'
    }
};
//=========================================

exports.server = {
    address: "127.0.0.1",
    port: 6001
};
exports.server.domain = 'http://' + exports.server.address + ':' + exports.server.port;



//======[REQUIRED*] deployment config for vps
exports.server = {
    address: '1.1.1.1', // your own vps server ip
    port: 80
};
exports.server.domain = 'http://jlxy.cz'; // your own domain
//=========================================
