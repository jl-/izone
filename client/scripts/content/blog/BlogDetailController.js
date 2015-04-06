;
'use strict';
angular.module('app')
    .controller('BlogDetailController', ['$rootScope','$scope','$stateParams','$location','APP_CONFIG',
        function($rootScope,$scope,$stateParams,$location,APP_CONFIG) {
            var scope = this;
            scope.domain = APP_CONFIG.api.base;
            scope.categories = $scope.$parent.blogCtrl.categories;
            $scope.$parent.$parent.contentCtrl.status.isArchivePanelHidden = true;
            scope.categories.$promise.then(function(){
                var len = scope.categories.length - 1;
                var category = null;
                for( ; len >=0 ; len--){
                    if(scope.categories[len].name === $stateParams.categoryName){
                        scope.category = scope.categories[len];
                        break;
                    }
                }
                len = scope.category.posts.length - 1;
                for( ; len>=0 ; len--){
                    if(scope.category.posts[len]._id === $stateParams.postId){
                        scope.post = scope.category.posts[len];
                        $rootScope.title = scope.post.title;
                        break;
                    }
                }
            });
            $scope.$on('$viewContentLoaded', function(event, viewConfig) {
            });
        }
    ]);