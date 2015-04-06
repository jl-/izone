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