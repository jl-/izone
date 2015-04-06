;'use strict';
angular.module('app')
    .controller('AboutController', ['$scope', '$rootScope', 'profile', function($scope,$rootScope,profile){
        var scope = this;
        scope.profile = profile;
        scope.profile.$promise.then(function(){
            console.log('//////// about page //////');
            console.log(scope);
        });

        $scope.$on('$viewContentLoaded',function(){
            $rootScope.title = 'about me';
        });
    }]);