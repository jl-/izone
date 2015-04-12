;
'use strict';
angular.module('app')
    .controller('BlogController', ['$rootScope','$scope', '$stateParams', '$state','categories', 'posts', 'APP_CONFIG',
        function($rootScope,$scope, $stateParams, $state,categories,posts,APP_CONFIG) {
            var scope = this;
            scope.categories = categories;
            console.log('////////// blog controller ///////////');
            scope.sortedPosts = [];
            scope.archives = [];
            scope.status = {};
            scope.status.postsViewType = 'categories';
            scope.domain = APP_CONFIG.api.base;
            scope.changePostsViewType = function(type) {
                scope.status.postsViewType = type;
            };


            scope.posts = {};
            scope.posts.pages = [];
            scope.posts.pages[0] = posts;
            scope.posts.list = [];

            function getCategory(id){
                var category = null;
                for(var i = scope.categories.length - 1; i>=0 ; i--){
                    if(scope.categories[i]._id === id){
                        category = scope.categories[i];
                        break;
                    }
                }
                return category;
            }
            scope.setCurrentCategory = function(category) {
                scope.currentCategory = getCategory(category._id);
                scope.status.viewingPosts = true;
                console.log(scope.currentCategory);
            };



            scope.readMore = function(post, $event) {
                $event.preventDefault();
                $event.stopPropagation();
                var target = angular.element($event.target);
                if (angular.element($event.target).hasClass('read-more')) {
                    scope.status.readingPost = true;
                    $state.go('blog.detail',{
                        date: post.date,
                        hash: post.hash
                    });
                }
            };

            ////////////////////////////
            /// archive
            /////////////////////////////////
            function archive(){
                var len = scope.sortedPosts.length-1;
                var dates = [];
                for(; len >=0 ; len -- ){
                    dates.unshift(new Date(scope.sortedPosts[len].createdAt));
                }
                len = dates.length -1;
                for( ; len >=0 ; len-- ){
                    if(!dates[len+1] || dates[len].getFullYear() !== dates[len+1].getFullYear() || dates[len].getMonth() !== dates[len+1].getMonth()){
                        var breakPoint = {
                            title: '' + dates[len].getFullYear() + '/' + (dates[len].getMonth() +1),
                            posts: []
                        };
                        breakPoint.posts.push(scope.sortedPosts[len]);
                        scope.archives.unshift(breakPoint);
                    }else{
                        scope.archives[0].posts.push(scope.sortedPosts[len]);
                    }
                }
            }
            scope.sortPosts = function(){
                var len = scope.categories.length - 1;
                for( ; len >=0 ; len--){
                    scope.sortedPosts = scope.sortedPosts.concat( scope.categories[len].posts.map(function(value){
                        value.category = scope.categories[len].name;
                        value.cid = scope.categories[len]._id;
                        return value;
                    }) );
                }
                scope.sortedPosts.sort(function(a,b){
                    return b.createdAt > a.createdAt ? 1 : (b.createdAt < a.createdAt ? -1 : 0);
                });
                archive();
            };
            scope.categories.$promise.then(function() {
                scope.sortPosts();
            });


            scope.goToPage = function(page){

            };
            scope.makeHref = function(post) {
                console.log(post);
            };

            scope.posts.pages[0].$promise.then(function(posts){
                scope.posts.list = posts;
            });
            $scope.$on('viewPost',function(data){
            });
            $scope.$parent.contentCtrl.status.isArchivePanelHidden = false;

            $scope.$on('$viewContentLoaded',function(){
                $rootScope.title = 'Post';
            });
        }

    ]);