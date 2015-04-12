;
'use strict';

angular.module('app.config', [])
    .constant('APP_CONFIG', (function() {

        var domain = 'http://localhost:6001'; // dev



        //=====[REQUIRED*] deployment config for vps
        domain= 'http://jlxy.cz';
        //=============================================== end of deployment config

        var api = {
            base: domain,
            login: domain + '/session',
            profile: domain + '/profile',
            category: domain + '/categories',
            //post: domain + '/categories/:categoryId/posts',
            post: domain + '/posts',
            avatar: domain + '/profile/avatar',
            portfolio: domain + '/portfolio'
        };

        //=====[REQUIRED*] deployment config for vps
        var qiniu = {
            base: 'http://qiniu.com',
            IZONE: 'http://i-zone.qiniudn.com/' // your own qiniu domain
        };
        //=============================================== end of deployment config

        return {
            api: api,
            qiniu: qiniu
        };
    })());