'use strict';

angular.module('cgAngularApp')
  .controller('TopnavCtrl', function ($scope, $rootScope) {
    $scope.showCollapsedNav = true;
    $scope.menuCollapsedClass = function(){
        return $scope.showCollapsedNav ? '' : 'collapsed';
    }
		$scope.toggleLaunchpad = function(){
			$rootScope.showContentBrowser = !$rootScope.showContentBrowser;
		}
  });
