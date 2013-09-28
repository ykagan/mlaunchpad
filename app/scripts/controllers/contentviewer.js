'use strict';

angular.module('cgAngularApp')
	.controller('ContentviewerCtrl', function ($scope, $stateParams, Container, $sce, $rootScope) {
		if ($stateParams.item) {
			$scope.itemId = $stateParams.item;
			$scope.item = Container.GetItem($scope.itemId);
			$scope.item.$promise.then(function(){
				$scope.urlSafe = $sce.trustAsResourceUrl("http://www.worthpublishers.com/brainhoney/resource/" + $scope.item.Url);

			});
			$rootScope.showContentBrowser = false;
		}

	});
