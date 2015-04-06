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