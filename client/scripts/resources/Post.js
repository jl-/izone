;'use strict';

angular.module('app.resource')
    .factory('Post', ['$resource','APP_CONFIG',function($resource,APP_CONFIG){
    return $resource(APP_CONFIG.api.post, null, {
        create: {
            method: 'POST'
        },
        delete:{
            method: 'DELETE',
            url: APP_CONFIG.api.post + '/:postId'
        },
        list:{
            method: 'GET'
        },
        getOne:{
            method: 'GET',
            url: APP_CONFIG.api.post + '/:postId'
        },
        update:{
            method: 'PUT',
            url: APP_CONFIG.api.post + '/:postId'
        } 
    });
}]);