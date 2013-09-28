'use strict';

angular.module('cgAngularApp')
  .controller('MainCtrl', function ($scope, $rootScope, $state) {
		$rootScope.showContentBrowser = true;
		$rootScope.course = {
			id: "139916"
		}

		if ($state.params.item) {
			$rootScope.showContentBrowser = false;
		}
		else
			$rootScope.showContentBrowser = true;
  });
