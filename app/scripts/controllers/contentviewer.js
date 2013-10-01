'use strict';

angular.module('cgAngularApp')
	.controller('ContentviewerCtrl', function ($scope, $stateParams, Container, $sce, $rootScope, item) {
		if ($stateParams.item) {
			$scope.itemId = $stateParams.item;
			$scope.item = item;//Container.GetItem($scope.itemId);
			//$scope.item.$promise.then(function(){
			$scope.urlSafe = $sce.trustAsResourceUrl($scope.item.Url);
			$rootScope.title = $scope.item.Title;
			//});
		}

	});
