;'use strict';
angular.module('app')
    .controller('ContentController', ['$scope', function($scope){
        var scope = this;
        scope.status = {};
        scope.toggleArchievePanel = function(isClose,$event){
            scope.status.isArchivePanelHidden = isClose !== undefined ? isClose : ! scope.status.isArchivePanelHidden;
        };
    }]);