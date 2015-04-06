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
