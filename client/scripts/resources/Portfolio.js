;'use strict';

angular.module('app.resource')
    .factory('Portfolio', ['$resource','APP_CONFIG',function($resource,APP_CONFIG){
    return $resource(APP_CONFIG.api.portfolio, null, {
        list:{
            method: 'GET',
            isArray: true
        },
        getOne : {
            method: 'GET',
            url: APP_CONFIG.api.portfolio + '/:portfolioId'
        },
        create: {
            method: 'POST'
        },
        update:{
            method: 'PUT',
            url: APP_CONFIG.api.portfolio + '/:portfolioId'
        },
        delete:{
            method: 'DELETE',
            url: APP_CONFIG.api.portfolio + '/:portfolioId'
        }
    });
}]);