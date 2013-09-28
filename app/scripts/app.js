'use strict';

angular.module('cgAngularApp', ['ui.router', 'ngCookies','ngResource', 'ngAnimate'])
	.config(function ($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('login', {
				url: '',
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl'
			})
			.state('main', {
				url: '/main',
				abstract: true,
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.state('main.contentviewer', {
				url: "/contentviewer/:container/:item",
				views: {
					"contentviewer@main": {templateUrl: 'views/contentviewer.html' },
					"contentbrowser@main": {templateUrl: 'views/contentbrowser.html' }
				}
			})
	})
	.run(function ($rootScope, $location, Account) {

		$rootScope.$on("$routeChangeStart", function (event, next, current) {
			if (Account.isLoggedIn()) {
				$location.path('/main');
			}
			else {
				$location.path('/login');
			}
		});

	})
	.run(
		[        '$rootScope', '$state', '$stateParams',
			function ($rootScope, $state, $stateParams) {

				// It's very handy to add references to $state and $stateParams to the $rootScope
				// so that you can access them from any scope within your applications.For example,
				// <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
				// to active whenever 'contacts.list' or one of its decendents is active.
				$rootScope.$state = $state;
				$rootScope.$stateParams = $stateParams;
			}]);
