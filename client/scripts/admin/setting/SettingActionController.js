;
'use strict';
angular.module('app')
    .controller('SettingActionController', ['$scope',
        function($scope) {
            var scope = this;


            scope.syncProfile = function() {
                $scope.$emit('syncProfileAction');
            };
            scope.addRecord = function(){
                $scope.$emit('addSettingRecordAction');
            };

        }
    ]);