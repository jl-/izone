;
'use strict';
angular.module('app.auth')
    .factory('AuthService', ['$window',
        function($window) {
            var authService = {};
            authService.isAuthenticated = function() {
                return !!$window.sessionStorage.token;
            };
            return authService;
        }
    ]);