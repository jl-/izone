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
            post: domain + '/categories/:categoryId/posts',
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
;'use strict';
angular.module('app')
    .controller('AdminController', ['$rootScope','$scope','profile', function($rootScope,$scope,profile){
        var scope = this;
        scope.profile = profile;
        scope.status = {};
        console.log('////////// profile /////////');
        console.log(scope.profile);

        scope.toggleDrawer = function(isClosed,$event){
            scope.status.drawerClosed = isClosed === undefined ? ! scope.status.drawerClosed : isClosed;
        };

        /////////////////////////////////////////////////////////////////////////////
        /// adminController event handler
        /////////////////////////////////////////////////////////////////////////////
        $scope.$on('toggleDrawer',function(event,isClosed){
            scope.toggleDrawer(isClosed);
        });

        $scope.$on('postPreviewAction',function(){
           $scope.$broadcast('previewPost');
        });
        $scope.$on('showPostTags',function(event,tags){
            $scope.$broadcast('showTags',tags);
        });
        $scope.$on('savePost',function(event){
            $scope.$broadcast('syncPost');
        });

        $scope.$on('syncProfileAction',function(){
            $scope.$broadcast('syncProfile');
        });

        $scope.$on('addSettingRecordAction',function(){
            $scope.$broadcast('addSettingRecord');
        });
        $scope.$on('addPortfolioAction',function(){
            $scope.$broadcast('addPortfolio');
        });



    }]);
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
/**
 *
 * Created by jl on 2/12/15.
 */
angular.module('app.utils')
    .factory('Utils',function(){
        var Utils = {};

        // insert at cursor
        Utils.insertStrAfterCursor = function _insertStrAfterCursor(obj,str) {
            if (document.selection) {
                var sel = document.selection.createRange();
                sel.text = str;
                return sel.text;
            } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                var startPos = obj.selectionStart,
                    endPos = obj.selectionEnd,
                    cursorPos = startPos,
                    tmpStr = obj.value;
                obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                cursorPos += str.length;
                obj.selectionStart = obj.selectionEnd = cursorPos;
                return obj.value;
            } else {
                obj.value += str;
                return obj.value;
            }
        };

        return Utils;
    });

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
            method: 'GET'
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
angular.module('app.auth', []);
;
'use strict';
angular.module('app.auth')
    .constant('AUTH_EVENTS', {
        loginSucceeded: 'auth-login-successful',
        loginFailed: 'auth-login-failed',
        logoutSucceeded: 'auth-logout-successful',
        tokenExpired: 'auth-token-expired',
        notAuthenticated: 'auth-not-authenticated'
    });
;
'use strict';
angular.module('app.auth')
    .factory('AuthInterceptor', ['$rootScope','$window','$q','AUTH_EVENTS',
        function($rootScope,$window,$q,AUTH_EVENTS) {
            return {
                request: function(config) {
                    config.headers = config.headers || {};
                    if ($window.sessionStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                    }
                    console.log(config);
                    return config;
                },
                responseError: function(response) {
                    $rootScope.$broadcast({
                        401: AUTH_EVENTS.notAuthenticated,
                        440: AUTH_EVENTS.tokenExpired
                    }[response.status], response);
                    return $q.reject(response);
                }
            };
        }
    ]);


angular.module('app.auth').config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }
]);
;
'use strict';
angular.module('app.auth')
    .factory('AuthService', ['$window',
        function($window) {
            var authService = {};
            authService.isAuthenticated = function() {
                return !!$window.sessionStorage.token;
            };
            return authService;
        }
    ]);
;
'use strict';
angular.module('app.auth')
    .controller('AuthController', ['$scope','$http','$window','APP_CONFIG','AUTH_EVENTS',
        function($scope,$http,$window,APP_CONFIG,AUTH_EVENTS) {
            var scope = this;
            scope.status = {};

            scope.account = {
                email: '',
                password: ''
            };

            scope.login = function(account){
                if(account && account.email && account.password){
                    scope.status.processing = true;
                    $http.post(APP_CONFIG.api.login,account)
                        .success(function(data){
                            console.log(data);
                            $window.sessionStorage.token = data.token;
                            $scope.$emit(AUTH_EVENTS.loginSucceeded);
                        })
                        .error(function(data){
                            console.log(data);
                            scope.error = data.msg;
                        })
                        .finally(function(){
                            scope.status.processing = false;
                        });
                }
            };

            scope.dismissError = function(){
                delete scope.error;
            };

        }
    ]);
;
'use strict';
angular.module('app')
    .controller('PostController', ['$scope', 'APP_CONFIG', 'NotificationService', 'Category', 'categories', 'Post', 'ModalProvider', 'Utils',
        function($scope, APP_CONFIG, NotificationService, Category, categories, Post, ModalProvider,Utils) {
            var scope = this;
            scope.status = {};
            scope.temps = {
                category: {},
                post: {}
            };
            scope.metas = {};
            scope.metas.qiniuImageViewOpt = {
                mode: 2,
                w: 620
            };

            scope.categories = categories;
            console.log(scope);

            ///////////
            /// category
            //////////////////////////////
            scope.createCategory = function() {
                if (scope.temps.category.toAdd && scope.temps.category.toAdd.length > 0) {
                    if (scope.categories.some(function(element, index, array) {
                        return element.name === scope.temps.category.toAdd;
                    })) {
                        return;
                    }
                    // save category to server
                    Category.create({
                        name: scope.temps.category.toAdd
                    }, function(category) {
                        delete scope.temps.category.toAdd;
                        scope.categories.push(category);
                        scope.status.addingCategory = false;
                    });
                } else {
                    scope.status.addingCategory = !scope.status.addingCategory;
                }
                console.log(scope);
            };

            scope.deleteCategory = function(index, $event) {
                $event.preventDefault();
                $event.stopPropagation();
                console.log(scope);
                NotificationService.confirm('will delete all posts in this category: ' + scope.categories[index].name + ' ok to continue.', function() {
                    Category.delete({
                        categoryId: scope.categories[index]._id
                    }, function(data) {
                        console.log(data);
                        if (scope.temps.category.index !== undefined) {
                            if (index === scope.temps.category.index) {
                                delete scope.category;
                                delete scope.temps.category.index;
                            } else if (index < scope.temps.category.index) {
                                scope.temps.category.index--;
                            }
                        }
                        if (scope.temps.post.cIndex !== undefined) {
                            if (scope.temps.post.cIndex === index) {
                                delete scope.post;
                                delete scope.temps.post.index;
                                delete scope.temps.post.cIndex;
                            } else if (scope.temps.post.cIndex > index) {
                                scope.temps.post.cIndex--;
                            }
                        }
                        scope.categories.splice(index, 1);
                        console.log(scope);
                    }, function(data) {
                        console.log(data);
                    });
                }, function() {

                });
            };

            scope.setCategory = function(index) {
                if (scope.status.renamingCategory) {
                    return;
                }
                scope.status.viewingPosts = true;
                if (!scope.categories[index].cached) {
                    Category.getOne({
                        categoryId: scope.categories[index]._id
                    }, function(category) {
                        console.log('///// get category /////');
                        category.cached = true;
                        scope.categories[index] = category;
                        scope.category = category;
                        scope.temps.category.index = index;
                        console.log(scope);
                        if(!scope.post){
                            scope.setPost(0);
                        }
                    });
                } else {
                    scope.category = scope.categories[index];
                    scope.temps.category.index = index;
                    console.log(scope);
                }
            };
            scope.isCategoryRenaming = function(index) {
                return index === scope.temps.category.renamingIndex;
            };
            scope.renameCategory = function(index, $event) {
                $event.preventDefault();
                $event.stopPropagation();
                if (!scope.status.renamingCategory) {
                    scope.status.renamingCategory = true;
                    scope.temps.category.renamingIndex = index;
                    scope.temps.category.originalName = scope.categories[index].name;
                } else {
                    if (scope.categories[index].name !== scope.temps.category.originalName) {
                        Category.update({
                            categoryId: scope.categories[index]._id
                        }, {
                            name: scope.categories[index].name
                        }).$promise.then(function(data) {
                            // rename succeed
                            NotificationService.alert('rename succeed');
                        }, function(data) {
                            // rename failed
                            scope.categories[index].name = scope.temps.category.originalName;
                            NotificationService.alert('rename failed..');
                        }).finally(function() {
                            scope.status.renamingCategory = false;
                            delete scope.temps.category.renamingIndex;
                            delete scope.temps.category.originalName;
                        });
                    } else {
                        scope.status.renamingCategory = false;
                        delete scope.temps.category.renamingIndex;
                        delete scope.temps.category.originalName;
                    }
                }
            };

            /////////////////
            /// post
            /// ////////////////////////////////////
            scope.createPost = function() {
                Post.create({
                    categoryId: scope.category._id
                }, null, function(post) {
                    console.log('////// create post//////');
                    console.log(post);
                    scope.category.posts.unshift(post);
                });
            };
            scope.updatePost = function(callback) {
                if (scope.temps.post.modified) {
                    Post.update({
                        categoryId: scope.categories[scope.temps.post.cIndex]._id,
                        postId: scope.post._id
                    }, scope.post, function(post) {
                        console.log('///////// update post //////');
                        console.log(post);
                        delete scope.temps.post.modified;
                        if(callback){
                            callback();
                        }
                        NotificationService.alert('sync post succeed');
                    }, function(data) {
                        NotificationService.alert('sync post failed');
                    });
                }
            };
            scope.isCurrentPost = function(index) {
                return index === scope.temps.post.index;
            };

            function setPost(index){
                delete scope.temps.post._post;
                scope.post = scope.category.posts[index];
                scope.temps.post._post = angular.copy(scope.category.posts[index]);
                scope.temps.post.index = index;
                scope.temps.post.cIndex = scope.temps.category.index;
                scope.temps.post.modified = false;
            }

            scope.setPost = function(index) {
                if(scope.temps.post.modified){
                   NotificationService.confirm('pre post modified, save it ?',function(){
                        scope.updatePost(function(){
                            setPost(index);
                        });
                   },function(){
                        $scope.$apply(function(){
                            scope.categories[scope.temps.post.cIndex].posts[scope.temps.post.index] = scope.temps.post._post;
                            setPost(index);
                        });
                   }); 
                }else{
                    setPost(index);
                }
            };
            scope.deletePost = function(index, $event) {
                $event.preventDefault();
                $event.stopPropagation();
                console.log('////// before delete post ////');
                console.log(scope);
                NotificationService.confirm('sure you want to delete this post: ' + scope.category.posts[index].title + ' ?', function() {
                    Post.delete({
                        categoryId: scope.category._id,
                        postId: scope.category.posts[index]._id
                    },function(post){
                        console.log('///// delete post /////');
                        console.log(post);
                        if(scope.post){
                            if(scope.temps.post.cIndex === scope.temps.category.index){
                                if(scope.temps.post.index === index){
                                    scope.temps.post = {};
                                    delete scope.post;
                                }else if(scope.temps.post.index > index){
                                    scope.temps.post.index --;
                                }
                            }
                        }
                        scope.category.posts.splice(index,1);
                        console.log(scope);
                    });
                }, function() {

                });
            };

            //////// tags
            scope.addTag = function() {
                if(!scope.post) return;
                if (scope.temps.post.newTag && scope.temps.post.newTag.length > 0) {
                    if (scope.post.tags.indexOf(scope.temps.post.newTag) === -1) {
                        scope.post.tags.push(scope.temps.post.newTag);
                        delete scope.temps.post.newTag;
                        scope.markModified();
                    }
                } else {
                    scope.status.addingTag = !scope.status.addingTag;
                }
            };
            scope.removeTag = function(index) {
                scope.post.tags.splice(index, 1);
                scope.markModified();
            };


            /////////////// insertImg
            scope.uploaderOpts = {
                uptoken_url: APP_CONFIG.api.post + '/uptoken',
                domain: APP_CONFIG.qiniu.IZONE,

                unique_names: false,
                save_key: false,

                init: {
                    FilesAdded: function(up,files){
                        $scope.$apply(up);
                    },
                    UploadProgress: function(up,file){
                        console.log('/////// progress ///////');
                        console.log(file);
                    },
                    FileUploaded: function(up,file,info){
                        scope.insertImg(info);
                    },
                    UploadComplete: function(){
                        console.log('upload complete');
                        scope.cancelUploadPostImg();
                    },
                    Error: function(up,err,errTip){

                    },
                    Key: function(up,file){
                        var key = file.name;
                        return key;
                    }
                }
            };
            scope.bla  = 'dfesblabla';
            scope.modal = ModalProvider.fromTemplateUrl('partials/admin/post/img-insert.tpl.html',{
                scope: $scope,
                pre_append: true
            });
            console.log(scope.modal);
            scope.openImgInsertPanel = function(){
                if(!scope.post) return;
                scope.status.insertingImg = true;
                scope.modal.show();
            };
            scope.uploadPostImg = function($event){
                console.log('upload post img');
                scope.uploader.start();
            };
            scope.insertImg = function(info){
                info = JSON.parse(info);
                console.log(info);
                if(info && info.key){
                    var src = Qiniu.imageView2(scope.metas.qiniuImageViewOpt,info.key);
                    src = '\n![' + info.key + '](' + src + ')\n';
                    $scope.$apply(function(){
                        scope.post.content = Utils.insertStrAfterCursor(document.querySelector('.post-editor-content'),src);
                    });
                    scope.markModified();
                }
            };
            scope.cancelUploadPostImg = function(){
                scope.uploader.splice();
                scope.modal.hide();
            };

            ////////////////////////////////// end



            ///////////////////////////
            /// mark modified
            ///////////////////////////////////////////
            scope.markModified = function() {
                scope.temps.post.modified = true;
            };

            /*******
             *  tab key
             ************/
            scope.tab = function(event){
                if (event.keyCode === 9) {
                    event.preventDefault();
                    scope.post.content = Utils.insertStrAfterCursor(event.target,'    ');
                }
            };

            ///////////////////////////////////
            /// post preview
            ///////////////////////////////////
            scope.preview = function() {
                scope.status.previewing = scope.post && !scope.status.previewing;
            };


            //////////////////
            /// event handler
            //////////////////////////////////////////////////
            $scope.$on('previewPost', function(event, toPreview) {
                scope.preview();
            });
            $scope.$on('syncPost', function(event) {
                scope.updatePost();
            });

        }
    ]);
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
;
'use strict';
angular.module('app')
    .controller('SettingController', ['$scope', '$window', '$state', 'Profile', 'NotificationService', 'APP_CONFIG',
        function($scope, $window, $state, Profile, NotificationService, APP_CONFIG) {
            var scope = this;

            scope.profile = $scope.$parent.adminCtrl.profile;
            scope.metas = {};
            scope.status = {};
            scope.temps = {};
            scope.errors = {};
            scope.temps.rawAvatarFile = null;
            scope.temps.rawAvatar = '';
            scope.temps.croppedAvatar = '';

            function dataURItoBlob(dataURI) {
                var binary = atob(dataURI.split(',')[1]);
                var array = [];
                for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {
                    type: 'image/jpeg'
                });
            }

            function handleAvatarSelect(e) {
                var file = e.target.files[0];
                scope.temps.rawAvatarFile = file;
                var reader = new FileReader();
                reader.onload = function(e) {
                    $scope.$apply(function() {
                        scope.temps.rawAvatar = e.target.result;
                    });
                };
                reader.readAsDataURL(file);
            }

            scope.updateAvatar = function() {
                var data = new FormData();
                var b = dataURItoBlob(scope.temps.croppedAvatar);
                data.append('avatar.jpeg', b);
                data.append('profileId', scope.profile._id);
                Profile.updateAvatar(data, function(data) {
                    scope.profile.avatar = $scope.$parent.adminCtrl.profile.avatar = data.avatar;
                    scope.status.settingAvatar = false;
                });
            };

            scope.metas.skillStates = ['expert', 'amatuer'];

            scope.metas.skills = [{
                name: 'design',
                icon: 'fa-behance-square'
            }, {
                name: 'wordpress',
                icon: 'fa-wordpress'
            }, {
                name: 'ios',
                icon: 'fa-apple'
            }, {
                name: 'android',
                icon: 'fa-android'
            }, {
                name: 'html',
                icon: 'fa-html5'
            }, {
                name: 'css',
                icon: 'fa-css3'
            }, {
                name: 'js',
                icon: 'fa-code'
            }, {
                name: 'php',
                icon: 'fa-code'
            }, {
                name: 'git',
                icon: 'fa-git-square'
            }];
            scope.metas.skillsToAdd = [];
            scope.metas.skillsGotten = [];

            /////////////////////////
            /// basis 
            ////////////////////////
            scope.setBirthday = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.status.settingBirthday = !scope.status.settingBirthday;
            };
            scope.addCharacter = function() {
                if (scope.temps.character && scope.temps.character.length > 0) {
                    if (scope.profile.characters.indexOf(scope.temps.character) === -1) {
                        scope.profile.characters.push(scope.temps.character);
                        delete scope.temps.character;
                    }
                }
            };
            scope.removeCharacter = function(index) {
                scope.profile.characters.splice(index, 1);
            };


            ////////////////////////
            /// skills
            ///////////////////////
            scope.addSkill = function(index, $event) {
                var skill = {
                    name: scope.metas.skillsToAdd[index].name,
                    state: '',
                    isMajor: true,
                    relatives: [],
                    description: ''
                };
                scope.profile.skills.unshift(skill);
                scope.metas.skillsGotten.unshift(scope.metas.skillsToAdd.splice(index, 1)[0]);
                scope.status.selectingSkillToAdd = false;
                scope.setCurrentSkill(0);
            };
            scope.removeSkill = function(index, $event) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.profile.skills.splice(index, 1);
                scope.metas.skillsToAdd.unshift(scope.metas.skillsGotten.splice(index, 1)[0]);
                if (scope.temps.currentSkillIndex === index) {
                    scope.temps.currentSkill = scope.temps.currentSkillIcon = scope.temps.currentSkillIndex = null;
                }
            };
            scope.setCurrentSkill = function(index, $event) {
                if ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                }
                scope.temps.currentSkill = scope.profile.skills[index];
                scope.temps.currentSkillIcon = scope.metas.skillsGotten[index].icon;
                scope.temps.currentSkillIndex = index;
            };
            scope.setCurrentSkillState = function(index, $event) {
                scope.temps.currentSkill.state = scope.metas.skillStates[index];
                scope.status.selectingSkillState = false;
            };
            scope.addSkillRelative = function(){
                if(!scope.temps.currentSkill) return;
                if (scope.temps.skillRelativeToAdd && scope.temps.skillRelativeToAdd.length > 0) {
                    if (scope.temps.currentSkill.relatives.indexOf(scope.temps.skillRelativeToAdd) === -1) {
                        scope.temps.currentSkill.relatives.push(scope.temps.skillRelativeToAdd);
                        delete scope.temps.skillRelativeToAdd;
                    }
                }
            };
            scope.removeSkillRelative = function(index){
               scope.temps.currentSkill.relatives.splice(index,1); 
            };

            ////////////////////////////
            /// education
            ////////////////////////////
            scope.addEdu = function() {
                if (scope.status.addingEdu) {
                    return;
                }
                scope.status.addingEdu = true;
                scope.status.editingEdu = false;
                scope.status.viewingEdu = false;
                scope.temps.currentEdu = {};
                scope.errors = {};
                delete scope.temps.currentEduIndex;
            };
            scope.editEdu = function() {
                var _ = {};
                angular.copy(scope.temps.currentEdu, _);
                scope.temps.currentEdu = _;
                scope.status.editingEdu = true;
                scope.status.viewingEdu = false;
            };
            scope.saveEdu = function() {
                if (!scope.temps.currentEdu.school) {
                    scope.errors.eduSchool = 'school name is required';
                    return;
                }
                if (!scope.temps.currentEdu.startYear) {
                    scope.errors.eduStartYear = 'startYear is required';
                    return;
                }
                if (scope.temps.currentEduIndex !== undefined) {
                    // edit
                    scope.status.editingEdu = false;
                    scope.profile.edu[scope.temps.currentEduIndex] = scope.temps.currentEdu;
                    scope.setCurrentEdu(scope.temps.currentEduIndex);

                } else {
                    // add
                    scope.profile.edu.unshift(scope.temps.currentEdu);
                    scope.status.addingEdu = false;
                    scope.setCurrentEdu(0);
                }
            };
            scope.deleteEdu = function() {
                scope.profile.edu.splice(scope.temps.currentEduIndex, 1);
                scope.temps.currentEdu = {};
                scope.status.editingEdu = false;
                delete scope.temps.currentEduIndex;
                if (scope.profile.edu.length === 0) {
                    scope.addEdu();
                } else {
                    scope.setCurrentEdu(0);
                }
            };
            scope.setCurrentEdu = function(index, $event) {
                scope.temps.currentEdu = scope.profile.edu[index];
                scope.temps.currentEduIndex = index;
                scope.status.viewingEdu = true;
                scope.status.addingEdu = scope.status.editingEdu = false;
            };
            scope.cancelEditingEdu = function() {
                scope.status.editingEdu = false;
                if (scope.profile.edu.length > 0) {
                    scope.setCurrentEdu(scope.temps.currentEduIndex || 0);
                    scope.status.addingEdu = false;
                }
                scope.errors = {};
            };
            scope.isCurrentEdu = function(index) {
                return index === scope.temps.currentEduIndex;
            };

            //////////////
            /// experence
            ///////////////////////////
            scope.editExperience = function(index){
                scope.temps.experience = angular.copy(scope.profile.experiences[index]);
                scope.temps.currentExperienceIndex = index;
                scope.status.editingExperience = true;
                scope.status.addingExperience = false;
            };
            scope.addExperience = function(){
                scope.temps.experience = {};
                scope.status.editingExperience = false;
                scope.status.addingExperience = true;
            };
            function isExperienceValid(){
                var isValid = true;
                if (!scope.temps.experience.company) {
                    scope.errors.experienceCompanyName = 'company name is required';
                    isValid = false;
                }
                if (!scope.temps.experience.title) {
                    scope.errors.experienceTitle = 'job title is required';
                    isValid = false;
                }
                return isValid;
            }
            scope.saveExperience = function(){
                if (!isExperienceValid()) {
                    return;
                }
                if (scope.status.editingExperience) {
                    scope.profile.experiences[scope.temps.currentExperienceIndex] = scope.temps.experience;
                } else {
                    scope.profile.experiences.unshift(scope.temps.experience);
                }
                scope.temps.experience = {};
                scope.status.editingExperience = scope.status.addingExperience = false;
            };
            scope.cancelEditingExperience = function(){
                scope.temps.experience = {};
                delete scope.temps.currentExperienceIndex;
                scope.status.editingExperience = false;
                scope.status.addingExperience = false;
            };
            scope.deleteExperience = function(index){
                NotificationService.confirm('sure to delete experience? ', function() {
                    $scope.$apply(function() {
                        scope.profile.experiences.splice(index, 1);
                    });
                }, function() {

                });
            };


            /////////////////
            /// project
            /////////////////////////////////
            scope.editProject = function(index) {
                scope.temps.project = angular.copy(scope.profile.projects[index]);
                scope.temps.currentProjectIndex = index;
                scope.status.editingProject = true;
                scope.status.addingProject = false;
            };
            scope.addProject = function() {
                scope.temps.project = {};
                scope.temps.project.skills = [];
                scope.status.editingProject = false;
                scope.status.addingProject = true;
            };

            function isProjectValid() {
                var isValid = true;
                if (!scope.temps.project.name) {
                    scope.errors.projectName = 'proect name is required';
                    isValid = false;
                }
                if (!scope.temps.project.title) {
                    scope.errors.projectTitle = 'proect title is required';
                    isValid = false;
                }
                return isValid;
            }
            scope.saveProject = function() {
                if (!isProjectValid()) {
                    return;
                }
                if (scope.status.editingProject) {
                    scope.profile.projects[scope.temps.currentProjectIndex] = scope.temps.project;
                } else {
                    scope.profile.projects.unshift(scope.temps.project);
                }
                scope.temps.project = {};
                scope.status.editingProject = scope.status.addingProject = false;
            };
            scope.cancelEditingProject = function() {
                scope.temps.project = {};
                delete scope.temps.currentProjectIndex;
                scope.status.editingProject = false;
                scope.status.addingProject = false;
                delete scope.temps.projectSkillToAdd;
            };
            scope.deleteProject = function(index) {
                NotificationService.confirm('sure to delete project? ', function() {
                    $scope.$apply(function() {
                        scope.profile.projects.splice(index, 1);
                    });
                }, function() {

                });
            };
            scope.addProjectSkill = function() {
                if (scope.temps.projectSkillToAdd && scope.temps.projectSkillToAdd.length > 0) {
                    if (!scope.temps.project.skills.some(function(element) {
                        return element === scope.temps.projectSkillToAdd;
                    })) {
                        scope.temps.project.skills.push(scope.temps.projectSkillToAdd);
                        delete scope.temps.projectSkillToAdd;
                    }
                }
            };
            scope.removeProjectSkill = function(index) {
                scope.temps.project.skills.splice(index,1);
            };


            scope.syncProfile = function() {
                scope.profile = Profile.update(scope.profile, function(profile) {
                    NotificationService.alert('sync profile succeed.');
                });
            };



            scope.dismissError = function(filed) {
                delete scope.errors[filed];
            };



            $scope.$on('syncProfile', function() {
                scope.syncProfile();
            });
            $scope.$on('addSettingRecord', function() {
                if ($state.is('admin.setting.experience')) {
                    if (scope.status.editingExperience) {
                        NotificationService.confirm('save current experience ? ', function() {

                        }, function() {
                            // reset project and temps.project
                        });
                    } else {
                        scope.addExperience();
                    }
                } else {
                    if (scope.status.editingProject) {
                        NotificationService.confirm('save current project ? ', function() {

                        }, function() {
                            // reset project and temps.project
                        });
                    } else {
                        scope.addProject();
                    }
                }
            });

            scope.profile.$promise.then(function() {
                var index = scope.metas.skills.length - 1,
                    _index;
                for (; index >= 0; index--) {
                    if (scope.profile.skills.some(function(element, i) {
                        _index = i;
                        return element.name === scope.metas.skills[index].name;
                    })) {
                        scope.metas.skillsGotten[_index] = scope.metas.skills[index];
                    } else {
                        scope.metas.skillsToAdd.push(scope.metas.skills[index]);
                    }
                }
                if (scope.profile.edu.length === 0) {
                    scope.addEdu();
                } else {
                    scope.setCurrentEdu(0);
                }

                angular.element(document.querySelector('#avatar-selector-input')).on('change', handleAvatarSelect);
            });
        }
    ]);
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
;
'use strict';
angular.module('app')
    .controller('PortfolioController', ['$scope', '$window', 'Portfolio', 'portfolios', 'NotificationService','APP_CONFIG',
        function($scope, $window, Portfolio, portfolios, NotificationService,APP_CONFIG) {
            var scope = this;
            scope.status = {};
            scope.metas = {};
            scope.metas.qiniuImageViewOpt = {
                mode: 2,
                w: 320
            };
            scope.temps = {};

            console.log(portfolios);
            portfolios.$promise.then(function(){
                console.log(portfolios);
                scope.portfolios = portfolios.map(function(portfolio){
                    //portfolio.src = APP_CONFIG.qiniu.IZONE + '/' + portfolio.key;
                    portfolio.src = Qiniu.imageView2(scope.metas.qiniuImageViewOpt,portfolio.key);
                    return portfolio;
                });
                console.log(scope);
            });

            // @ref: http://developer.qiniu.com/docs/v6/sdk/javascript-sdk.html
            scope.uploaderOpts = {
                uptoken_url: APP_CONFIG.api.portfolio + '/uptoken',
                domain: APP_CONFIG.qiniu.IZONE,

                // x_vars:{}
                x_vars: function(){
                    var vars = {};
                    'title,link,description'.split(',').forEach(function(meta){
                       vars[meta] = function(up,file){
                           return file.metas && file.metas[meta];
                       }
                    });
                    return vars;
                }(),

                unique_names: false,
                save_key: false,

                init: {
                    FilesAdded: function(up,files){
                        $scope.$apply(up);
                    },
                    UploadProgress: function(up,file){
                        console.log('/////// progress ///////');
                        console.log(file);
                        $scope.$apply(file);
                    },
                    FileUploaded: function(up,file,info){
                        console.log(info);
                        var p =JSON.parse(info);
                        scope.portfolios.unshift(p);
                    },
                    UploadComplete: function(){
                        console.log('upload complete');
                        scope.status.adding = false;
                        scope.uploader.splice();
                        
                    },
                    Error: function(up,err,errTip){

                    },
                    Key: function(up,file){
                        var key = file.name;
                        return key;
                    }
                }
            };
            scope.upload = function(){
                console.log(scope.uploader);
                scope.uploader.start();
            };
            scope.createPortfolios = function(){
                console.log(scope.uploader);
            };
            scope.removeFile = function(file){
                scope.uploader.removeFile(file);

            };


            ///////
            scope.editPortfolioItem = function(portfolio,index){
                console.log(portfolio);
                portfolio.status = portfolio.status || {};
                if(portfolio.status.editing){
                    Portfolio.update({
                        portfolioId: portfolio._id
                    },portfolio).$promise.then(function(data){
                            console.log('edit succeed');
                            console.log(data);
                        },function(data){
                            console.log('edit faild');
                            console.log(data);
                        }).finally(function(){
                            delete portfolio.status;
                        });

                }else{
                    portfolio.status.editing = true;
                }
            };
            scope.deletePortfolioItem = function(portfolio,index){
                console.log(portfolio);
                NotificationService.confirm("sure?",function(){
                    Portfolio.delete({
                        portfolioId: portfolio._id
                    }).$promise.then(function(data){
                            console.log("delete succeed");
                            console.log(data);
                            scope.portfolios.splice(index,1);
                        });
                },function(){

                });
            };

            $scope.$on('addPortfolio', function() {
                scope.status.adding = !scope.status.adding;
            });
        }
    ]);
;'use strict';
angular.module('app')
    .controller('PortfolioActionController', ['$scope', function($scope){
        var scope = this;
        scope.add = function(){
            $scope.$emit('addPortfolioAction');
        };
    }]);