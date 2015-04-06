;
'use strict';
angular.module('app.auth')
    .controller('AuthController', ['$scope','$http','$window','APP_CONFIG','AUTH_EVENTS',
        function($scope,$http,$window,APP_CONFIG,AUTH_EVENTS) {
            var scope = this;
            scope.status = {};

            scope.account = {
                email: '',
                password: ''
            };

            scope.login = function(account){
                if(account && account.email && account.password){
                    scope.status.processing = true;
                    $http.post(APP_CONFIG.api.login,account)
                        .success(function(data){
                            console.log(data);
                            $window.sessionStorage.token = data.token;
                            $scope.$emit(AUTH_EVENTS.loginSucceeded);
                        })
                        .error(function(data){
                            console.log(data);
                            scope.error = data.msg;
                        })
                        .finally(function(){
                            scope.status.processing = false;
                        });
                }
            };

            scope.dismissError = function(){
                delete scope.error;
            };

        }
    ]);