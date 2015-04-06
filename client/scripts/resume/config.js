;
define(function() {


    var config = {};

    config.domain = "http://localhost:6001";

    //=====[REQUIRED*] deployment config for vps
    config.domain = 'http://jlxy.cz';
    //===========================================

    config.server = {
        portfolio: config.domain + '/portfolio',
        profile: config.domain + '/profile'
    };

    //=====[REQUIRED*] config for qiniu
    config.qiniu = {
        IZONE: 'your own qiniu domain'
    };
    //==============================================


    return config;
});