'use strict';

angular.module('cgAngularApp', ['ui.router', 'ngCookies'])
	.config(function ($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('login', {
				url: '',
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl'
			})
			.state('main', {
				url: '/main',
				views:{
					"contentbrowser": {templateUrl: 'views/contentbrowser.html' },
					"contentviewer": {templateUrl: 'views/contentviewer.html' }
				},
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.state('main.contentbrowser', {
				templateUrl: 'views/contentbrowser.html',
				controller: 'ContentbrowserCtrl'
			})
			.state('main.contentviewer', {
				templateUrl: 'views/contentviewer.html',
				controller: 'ContentviewerCtrl'
			})
	})
	.run(function ($rootScope, $location, Account) {

		$rootScope.$on("$routeChangeStart", function (event, next, current) {
			if (Account.isLoggedIn()) {
				$location.path('/');
			}
			else {
				$location.path('/login');
			}
		});

	});
