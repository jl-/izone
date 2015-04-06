;'use strict';

angular.module('app.resource')
    .factory('Category', ['$resource','APP_CONFIG',function($resource,APP_CONFIG){
    return $resource(APP_CONFIG.api.category, null, {
        list:{
            method: 'GET',
            isArray: true
        },
        getOne : {
            method: 'GET',
            url: APP_CONFIG.api.category + '/:categoryId'
        },
        create: {
            method: 'POST'
        },
        update:{
            method: 'PUT',
            url: APP_CONFIG.api.category + '/:categoryId'
        },
        delete:{
            method: 'DELETE',
            url: APP_CONFIG.api.category + '/:categoryId'
        }
    });
}]);