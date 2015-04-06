;
'use strict';
angular.module('app', ['ui.router','ui.bootstrap','app.auth', 'app.config', 'app.resource', 'app.utils','ngAnimate','angularFileUpload','ngImgCrop','ngModal','ngImgThumb','ngQiniu'])
    .config(['$stateProvider', '$urlRouterProvider', '$animateProvider', 'APP_CONFIG',
        function($stateProvider, $urlRouterProvider, $animateProvider, APP_CONFIG) {
            $stateProvider

            // ======
            // 
            //  onEnter : change page title
            // 
            // ==============================
            .state('session', {
                url: '/login',
                templateUrl: 'partials/admin/auth/login.tpl.html',
                controller: 'AuthController as authCtrl'
            })

            .state('admin', {
                abstract: true,
                url: '/',
                resolve:{
                    profile: ['Profile',function(Profile){
                        return Profile.get();
                    }]
                },
                templateUrl: 'partials/admin/admin.tpl.html',
                controller: 'AdminController as adminCtrl',
                data: {
                    requiredAuthentication: true
                }
            })

            .state('admin.posts', {
                url: 'posts',
                resolve:{
                    categories: ['Category',function(Category){
                        return Category.list();
                    }]
                },
                views:{
                    'actionHolder': {
                        templateUrl: 'partials/admin/post/action.tpl.html',
                        controller: 'PostActionController as postActionCtrl'
                    },
                    '':{
                        templateUrl: 'partials/admin/post/post.tpl.html',
                        controller: 'PostController as postCtrl'
                    }
                }
            })

            .state('admin.setting',{
                url:'settings',
                views:{
                    'actionHolder': {
                        templateUrl: 'partials/admin/setting/action.tpl.html',
                        controller: 'SettingActionController as settingActionCtrl'
                    },
                    '':{
                        templateUrl: 'partials/admin/setting/setting.tpl.html',
                        controller: 'SettingController as settingCtrl'
                    }
                }
            })
            .state('admin.setting.basis',{
                url: '/basis',
                templateUrl: 'partials/admin/setting/basis.tpl.html'
            })
            .state('admin.setting.edu',{
                url: '/edu',
                templateUrl: 'partials/admin/setting/edu.tpl.html'
            })
            .state('admin.setting.skill',{
                url: '/skill',
                templateUrl: 'partials/admin/setting/skill.tpl.html'
            })
            .state('admin.setting.experience',{
                url: '/experience',
                templateUrl: 'partials/admin/setting/experience.tpl.html'
            })
            .state('admin.setting.project',{
                url: '/project',
                templateUrl: 'partials/admin/setting/project.tpl.html'
            })
            .state('admin.setting.contact',{
                url: '/contact',
                templateUrl: 'partials/admin/setting/contact.tpl.html'
            })


            .state('admin.portfolio',{
                url: 'portfolio',
                resolve:{
                    portfolios: ['Portfolio',function(Portfolio){
                        return Portfolio.list();
                    }]
                },
                views:{
                    'actionHolder': {
                        templateUrl: 'partials/admin/portfolio/action.tpl.html',
                        controller: 'PortfolioActionController as portfolioActionCtrl'
                    },
                    '':{
                        templateUrl: 'partials/admin/portfolio/portfolio.tpl.html',
                        controller: 'PortfolioController as portfolioCtrl'
                    }
                }
            })

            ;

            $urlRouterProvider.otherwise('/login');
            $animateProvider.classNameFilter(/^((?!(fa-spin)).)*$/);
        }
    ])
    .run(['$rootScope','$state','AUTH_EVENTS','AuthService',
        function($rootScope,$state,AUTH_EVENTS,AuthService) {

            $rootScope.$state = $state;

            $rootScope.$on(AUTH_EVENTS.loginSucceeded, function() {
                console.log('login succeed.');
                $state.go('admin.posts');
            });
            $rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
                console.log('not authorizated event broadcast, return to state: session');
                $state.go('session');
            });

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                console.log('stateChangeStart to: ' + toState.name);
                if (toState.data && toState.data.requiredAuthentication && !AuthService.isAuthenticated()) {
                    event.preventDefault();
                    console.log(toState.name + ' needs authenticate');
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            });
        }
    ]);