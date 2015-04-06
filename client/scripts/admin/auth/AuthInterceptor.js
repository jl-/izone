;
'use strict';
angular.module('app.auth')
    .factory('AuthInterceptor', ['$rootScope','$window','$q','AUTH_EVENTS',
        function($rootScope,$window,$q,AUTH_EVENTS) {
            return {
                request: function(config) {
                    config.headers = config.headers || {};
                    if ($window.sessionStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                    }
                    console.log(config);
                    return config;
                },
                responseError: function(response) {
                    $rootScope.$broadcast({
                        401: AUTH_EVENTS.notAuthenticated,
                        440: AUTH_EVENTS.tokenExpired
                    }[response.status], response);
                    return $q.reject(response);
                }
            };
        }
    ]);


angular.module('app.auth').config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }
]);