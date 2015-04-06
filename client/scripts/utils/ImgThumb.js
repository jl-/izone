;
'use strict';
/*========
thanks to https://github.com/nervgh/angular-file-upload/blob/master/examples/image-preview/directives.js
================*/
angular.module('app.utils')
    .directive('imgThumb', ['$window',
        function($window) {
            var helper = {
                support: !!$window.FileReader,
                isFile: function(item) {
                    return angular.isObject(item) && item instanceof $window.File;
                },
                isImage: function(file) {
                    var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            };
            return {
                restrict: 'A',
                template: '<img class="thumbnail"/>',
                link: function(scope, element, attrs) {
                    if (!helper.support) return;

                    var params = scope.$eval(attrs.imgThumb);

                    if (!helper.isFile(params.file)) return;
                    if (!helper.isImage(params.file)) return;

                    function loadImg(){
                        var img = element.find('img');
                        var reader = new FileReader();

                        reader.onload = function(e){
                            img[0].src = this.result;
                        };
                        reader.readAsDataURL(params.file);
                    }
                    loadImg();
                }

            };
        }
    ]);