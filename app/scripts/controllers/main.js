'use strict';

angular.module('cgAngularApp')
  .controller('MainCtrl', function ($scope, $rootScope, $state) {
		//$rootScope.showContentBrowser = true;

		if ($state.params.item) {
			$rootScope.showContentBrowser = false;
		}
		else
			$rootScope.showContentBrowser = true;

		$rootScope.title = "Myers 10e";
  });
