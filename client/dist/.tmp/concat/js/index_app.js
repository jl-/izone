;
'use strict';

angular.module('app.config', [])
    .constant('APP_CONFIG', (function() {

        var domain = 'http://localhost:6001'; // dev



        //=====[REQUIRED*] deployment config for vps
        domain= 'http://jlxy.cz';
        //=============================================== end of deployment config

        var api = {
            base: domain,
            login: domain + '/session',
            profile: domain + '/profile',
            category: domain + '/categories',
            //post: domain + '/categories/:categoryId/posts',
            post: domain + '/posts',
            avatar: domain + '/profile/avatar',
            portfolio: domain + '/portfolio'
        };

        //=====[REQUIRED*] deployment config for vps
        var qiniu = {
            base: 'http://qiniu.com',
            IZONE: 'http://i-zone.qiniudn.com/' // your own qiniu domain
        };
        //=============================================== end of deployment config

        return {
            api: api,
            qiniu: qiniu
        };
    })());
;
'use strict';
angular.module('app', ['ui.router', 'ui.bootstrap', 'app.config', 'app.resource', 'app.utils', 'ngAnimate'])
    .config(['$stateProvider', '$urlRouterProvider', '$animateProvider', 'APP_CONFIG',
        function($stateProvider, $urlRouterProvider, $animateProvider, APP_CONFIG) {
            $stateProvider

            ///////////////// 
            /// blog
            /// ///////////////////////////
            .state('blog', {
                url: '',
                abstract: 'true',
                resolve: {
                    categories: ['Category',
                        function(Category) {
                            return Category.list({
                                population: true
                            });
                        }
                    ],
                    posts: ['Post',function(Post){
                        return Post.list({
                            page: 1
                        });
                    }]
                },
                templateUrl: 'partials/content/blog/blog.tpl.html',
                controller: 'BlogController as blogCtrl'
            })

            .state('blog.list', {
                url: '/',
                templateUrl: 'partials/content/blog/list.tpl.html'
            })

            .state('blog.detail', {
                //url: '/categories/:categoryName/posts/:postId',
                url: '/articles/:date/:hash',
                templateUrl: 'partials/content/blog/detail.tpl.html',
                controller:'BlogDetailController as blogDetailCtrl'
            })

            //////////////////
            /// user
            /// ///////////////////////////
            
            .state('user',{
                url: '/about',
                resolve:{
                    profile: ['Profile',function(Profile){
                        return Profile.get();
                    }]
                },
                templateUrl: 'partials/content/about/about.tpl.html',
                controller: 'AboutController as aboutCtrl'
            })

            //////////////////
            /// portfolio
            ///////////////////////
            .state('portfolio',{
                url: "/portfolio",
                resolve:{
                    portfolios: ['Portfolio',function(Portfolio){
                        return Portfolio.list();
                    }]
                },
                templateUrl: 'partials/content/portfolio/portfolio.tpl.html',
                controller:'PortfolioController as portfolioCtrl'
            })

            ;

            $urlRouterProvider.otherwise('/');
            $animateProvider.classNameFilter(/^((?!(fa-spin)).)*$/);
        }
    ])
    .run(['$rootScope', '$state',
        function($rootScope, $state) {

            $rootScope.$state = $state;

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {});
        }
    ]);
;
'use strict';

angular.module('app.utils', []);
;
'use strict';
angular.module('app.utils')
    .factory('NotificationService', function() {
        var service = {};

        var mask = document.getElementById('gl-mask');
        var alertMsg = mask.getElementsByClassName('alert-msg')[0];
        var alertCloser = mask.getElementsByClassName('alert-closer')[0];
        var confirmMsg = mask.getElementsByClassName('confirm-msg')[0];
        var confirmBtn = mask.getElementsByClassName('confirm-btn')[0];
        var cancelBtn = mask.getElementsByClassName('cancel-btn')[0];

        var confirmCallback = null, cancelCallback = null, alertCallback = null;

        service.confirm = function(msg,confirmCb,cancelCb){
            mask.classList.add('confirm');
            confirmMsg.innerHTML = msg;
            confirmCallback = confirmCb;
            cancelCallback = cancelCb;
        };
        service.alert = function(msg,callback) {
            mask.classList.add('alert');
            alertMsg.innerHTML = msg;
            alertCallback = callback;
        };

       function done(){
            if (mask.classList.contains('alert')) {
                mask.classList.remove('alert');
                alertMsg.innerHTML = '';
            }
            if (mask.classList.contains('confirm')) {
                mask.classList.remove('confirm');
                confirmMsg.innerHTML = '';
            }
       } 
        alertCloser.onclick = function() {
            done();
            if(alertCallback){
                alertCallback();
            }
        };
        confirmBtn.onclick = function(){
            done();
            confirmCallback();
        };
        cancelBtn.onclick = function(){
            done();
            cancelCallback();
        };
        return service;
    });
;
'use strict';
angular.module('app.utils')
    .directive('markdownHighlight', function() {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                md: '=',
                rm: '=readmore'
            },
            link: function(scope, element, attr) {
                function mdhl(val) {
                    if (val) {
                        element.html(marked(val));
                        if (attr.readMore === 'true') {
                            var readMore = element[0].getElementsByClassName('read-more')[0];
                            if (readMore) {
                                readMore.classList.add('active');
                            }
                        }
                    }
                    var code = element.find('code');
                    if (code.length) {
                        angular.forEach(code, function(block) {
                            hljs.highlightBlock(block);
                        });
                    }
                }
                scope.$watch('md', mdhl);
            }
        };

    });
;
'use strict';
angular.module('app.utils')
    .directive('dirDisqus', ['$window',
        function($window) {
            return {
                restrict: 'E',
                scope: {
                    disqus_shortname: '@disqusShortname',
                    disqus_identifier: '@disqusIdentifier',
                    disqus_title: '@disqusTitle',
                    disqus_url: '@disqusUrl',
                    disqus_category_id: '@disqusCategoryId',
                    disqus_disable_mobile: '@disqusDisableMobile',
                    readyToBind: "@"
                },
                template: '<div id="disqus_thread"></div><a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>',
                link: function(scope) {

                    // ensure that the disqus_identifier and disqus_url are both set, otherwise we will run in to identifier conflicts when using URLs with "#" in them
                    // see http://help.disqus.com/customer/portal/articles/662547-why-are-the-same-comments-showing-up-on-multiple-pages-
                    if (typeof scope.disqus_identifier === 'undefined' || typeof scope.disqus_url === 'undefined') {
                        throw "Please ensure that the `disqus-identifier` and `disqus-url` attributes are both set.";
                    }

                    scope.$watch("readyToBind", function(isReady) {

                        // If the directive has been called without the 'ready-to-bind' attribute, we
                        // set the default to "true" so that Disqus will be loaded straight away.
                        if (!angular.isDefined(isReady)) {
                            isReady = "true";
                        }
                        if (scope.$eval(isReady)) {
                            // put the config variables into separate global vars so that the Disqus script can see them
                            $window.disqus_shortname = scope.disqus_shortname;
                            $window.disqus_identifier = scope.disqus_identifier;
                            $window.disqus_title = scope.disqus_title;
                            $window.disqus_url = scope.disqus_url;
                            $window.disqus_category_id = scope.disqus_category_id;
                            $window.disqus_disable_mobile = scope.disqus_disable_mobile;

                            // get the remote Disqus script and insert it into the DOM, but only if it not already loaded (as that will cause warnings)
                            if (!$window.DISQUS) {
                                var dsq = document.createElement('script');
                                dsq.type = 'text/javascript';
                                dsq.async = true;
                                dsq.src = '//' + scope.disqus_shortname + '.disqus.com/embed.js';
                                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
                            } else {
                                $window.DISQUS.reset({
                                    reload: true,
                                    config: function() {
                                        this.page.identifier = scope.disqus_identifier;
                                        this.page.url = scope.disqus_url;
                                        this.page.title = scope.disqus_title;
                                    }
                                });
                            }
                        }
                    });
                }
            };
        }
    ]);
;
'use strict';

angular.module('app.resource', ['ngResource']);
;'use strict';

angular.module('app.resource')
    .factory('Profile', ['$resource','APP_CONFIG',function($resource,APP_CONFIG){
    return $resource(APP_CONFIG.api.profile, null, {
        get:{
            method: 'GET'
        },
        update:{
            method: 'PUT'
        },
        updateAvatar: {
            url: APP_CONFIG.api.avatar,
            method: 'PUT',
            transformRequest: function(data,headersGetter){
                var headers = headersGetter();
                headers['Content-Type'] = undefined;
                console.log(headers); 
                console.log(data);
                return data;
            }
        }
    });
}]);
;'use strict';

angular.module('app.resource')
    .factory('Category', ['$resource','APP_CONFIG',function($resource,APP_CONFIG){
    return $resource(APP_CONFIG.api.category, null, {
        list:{
            method: 'GET',
            isArray: true
        },
        getOne : {
            method: 'GET',
            url: APP_CONFIG.api.category + '/:categoryId'
        },
        create: {
            method: 'POST'
        },
        update:{
            method: 'PUT',
            url: APP_CONFIG.api.category + '/:categoryId'
        },
        delete:{
            method: 'DELETE',
            url: APP_CONFIG.api.category + '/:categoryId'
        }
    });
}]);
;'use strict';

angular.module('app.resource')
    .factory('Post', ['$resource','APP_CONFIG',function($resource,APP_CONFIG){
    return $resource(APP_CONFIG.api.post, null, {
        create: {
            method: 'POST'
        },
        delete:{
            method: 'DELETE',
            url: APP_CONFIG.api.post + '/:postId'
        },
        list:{
            method: 'GET',
            isArray: true
        },
        getOne:{
            method: 'GET',
            url: APP_CONFIG.api.post + '/:postId'
        },
        update:{
            method: 'PUT',
            url: APP_CONFIG.api.post + '/:postId'
        } 
    });
}]);
;'use strict';

angular.module('app.resource')
    .factory('Portfolio', ['$resource','APP_CONFIG',function($resource,APP_CONFIG){
    return $resource(APP_CONFIG.api.portfolio, null, {
        list:{
            method: 'GET',
            isArray: true
        },
        getOne : {
            method: 'GET',
            url: APP_CONFIG.api.portfolio + '/:portfolioId'
        },
        create: {
            method: 'POST'
        },
        update:{
            method: 'PUT',
            url: APP_CONFIG.api.portfolio + '/:portfolioId'
        },
        delete:{
            method: 'DELETE',
            url: APP_CONFIG.api.portfolio + '/:portfolioId'
        }
    });
}]);
;'use strict';
angular.module('app')
    .controller('ContentController', ['$scope', function($scope){
        var scope = this;
        scope.status = {};
        scope.toggleArchievePanel = function(isClose,$event){
            scope.status.isArchivePanelHidden = isClose !== undefined ? isClose : ! scope.status.isArchivePanelHidden;
        };

    }]);
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



            scope.readMore = function(categoryName,postId, $event) {
                $event.preventDefault();
                $event.stopPropagation();
                var target = angular.element($event.target);
                if (angular.element($event.target).hasClass('read-more')) {
                    scope.status.readingPost = true;
                    $state.go('blog.detail',{
                        categoryName: categoryName,
                        postId: postId
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
;
'use strict';
angular.module('app')
    .controller('BlogDetailController', ['$rootScope','$scope','$stateParams','Post','$location','APP_CONFIG',
        function($rootScope,$scope,$stateParams,Post,$location,APP_CONFIG) {
            var scope = this;

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
;
'use strict';
angular.module('app')
    .controller('PortfolioController', ['$scope', '$rootScope', '$window', 'Portfolio', 'portfolios', 'APP_CONFIG',
        function($scope, $rootScope, $window, Portfolio, portfolios, APP_CONFIG) {
            var scope = this;
            scope.status = {};

            scope.portfolios = portfolios;
            portfolios.$promise.then(function(){
                console.log(portfolios);
                scope.portfolios = portfolios.map(function(portfolio){
                    portfolio.src = APP_CONFIG.qiniu.IZONE + portfolio.key + '?imageView2/2/w/1000';
                    return portfolio;
                });
            });

            scope.viewPortfolio = function(portfolio){
                if($window.innerWidth < 560){
                    return ;
                }
                scope.portfolio = portfolio;
                scope.status.viewingItem = !scope.status.viewingItem;
            };




            $scope.$on('$viewContentLoaded',function(){
                $rootScope.title = 'portfolios';
            });

        }
    ]);