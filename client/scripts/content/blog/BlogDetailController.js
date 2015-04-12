;
'use strict';
angular.module('app')
    .controller('BlogDetailController', ['$rootScope','$scope','$stateParams','Post','$location','APP_CONFIG',
        function($rootScope,$scope,$stateParams,Post,$location,APP_CONFIG) {
            var scope = this;

            scope.domain = APP_CONFIG.api.base;

            $scope.$parent.$parent.contentCtrl.status.isArchivePanelHidden = true;

            Post.list($stateParams,function(post){
                console.log(post);
                scope.post = post && post[0];
                $rootScope.title = scope.post.title;
            });

            $scope.$on('$viewContentLoaded', function(event, viewConfig) {
            });
        }
    ]);