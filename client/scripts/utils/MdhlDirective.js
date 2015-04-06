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