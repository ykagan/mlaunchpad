'use strict';

angular.module('cgAngularApp',  ['ngCookies'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/contentbrowser', {
        templateUrl: 'views/contentbrowser.html',
        controller: 'ContentbrowserCtrl'
      })
      .when('/contentviewer', {
        templateUrl: 'views/contentviewer.html',
        controller: 'ContentviewerCtrl'
      })
      .otherwise({
        redirectTo: '/login'
      });
  })
    .run(function ($rootScope, $location, Account) {

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if (Account.isLoggedIn()) {
                $location.path('/');
            }
            else{
                $location.path('/login');
            }
        });

    });
