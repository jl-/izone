;
'use strict';
angular.module('app')
    .controller('PostActionController', ['$scope',
        function($scope) {

            var scope = this;
            scope.status = {};
            scope.tags = [];
            scope.preview = function() {
                $scope.$emit('postPreviewAction');
            };
            $scope.$on('showTags', function(event, tags) {
                scope.tags = tags;
                scope.status.editable = true;
            });
            scope.save = function() {
                $scope.$emit('savePost');
            };
        }
    ]);