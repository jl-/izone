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