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