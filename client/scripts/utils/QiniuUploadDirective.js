/**
 *
 * Created by jl on 2/7/15.
 */
;'use strict';
angular.module('app.utils')
    .directive('qiniuUpload', function() {
        return {
            restrict: 'E',
            link: function(scope, element, attr) {
                element[0].id = 'qiniu-pick-file-btn';
            }
        };

    });
