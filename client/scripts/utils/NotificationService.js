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