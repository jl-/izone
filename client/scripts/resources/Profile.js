;'use strict';

angular.module('app.resource')
    .factory('Profile', ['$resource','APP_CONFIG',function($resource,APP_CONFIG){
    return $resource(APP_CONFIG.api.profile, null, {
        get:{
            method: 'GET'
        },
        update:{
            method: 'PUT'
        },
        updateAvatar: {
            url: APP_CONFIG.api.avatar,
            method: 'PUT',
            transformRequest: function(data,headersGetter){
                var headers = headersGetter();
                headers['Content-Type'] = undefined;
                console.log(headers); 
                console.log(data);
                return data;
            }
        }
    });
}]);