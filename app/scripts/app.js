'use strict';

angular.module('cgAngularApp', ['ui.router', 'ngCookies','ngResource', 'ngAnimate'])
	.config(function ($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl'
			})
			.state('main', {
				url: '/main',
				abstract: true,
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.state('main.contentbrowser', {
				url: "",
				views: {
					"contentbrowser@main": {
						templateUrl: 'views/contentbrowser2.html',
						resolve: {
							rootItems: ['Container', function (Container) {
								return Container.Getcontainer("Launchpad", "", "syllabusfilter").$promise;
							}]
						},
						controller: "ContentbrowserCtrl"
					}
				}
			})
			.state('main.contentbrowser.contentviewer', {
				url: "/contentviewer/:container/:item",
				views: {
					"contentviewer@main": {
						templateUrl: 'views/contentviewer.html',
						resolve: {
							item: ['Container', '$stateParams', function (Container, $stateParams) {
								return Container.GetItem($stateParams.item).$promise;
							}]
						},
						controller: "ContentviewerCtrl"
					}
				}

			})
	})
	.run(function ($rootScope, $location, Account) {
		if (!Account.isLoggedIn()) {
			$location.path('/login');
		}
		else
		{
			if(!$location.path())
			{
				$location.path('/main');
			}
		}
		$rootScope.$on("$routeChangeStart", function (event, next, current) {
			if (!Account.isLoggedIn()) {
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
