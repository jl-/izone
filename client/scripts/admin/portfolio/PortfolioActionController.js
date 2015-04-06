;'use strict';
angular.module('app')
    .controller('PortfolioActionController', ['$scope', function($scope){
        var scope = this;
        scope.add = function(){
            $scope.$emit('addPortfolioAction');
        };
    }]);