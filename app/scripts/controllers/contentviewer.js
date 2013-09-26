'use strict';

angular.module('cgAngularApp')
	.controller('ContentviewerCtrl', function ($scope, $stateParams, Container) {
		if ($stateParams.item) {
			$scope.itemId = $stateParams.item;
			$scope.item = Container.GetItem($scope.itemId);
		}

	});
