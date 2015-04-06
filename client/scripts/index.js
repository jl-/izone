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
                    ]
                },
                templateUrl: 'partials/content/blog/blog.tpl.html',
                controller: 'BlogController as blogCtrl'
            })

            .state('blog.list', {
                url: '/',
                templateUrl: 'partials/content/blog/list.tpl.html'
            })

            .state('blog.detail', {
                url: '/categories/:categoryName/posts/:postId',
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