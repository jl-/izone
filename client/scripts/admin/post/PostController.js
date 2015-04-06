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