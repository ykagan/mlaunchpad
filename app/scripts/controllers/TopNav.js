'use strict';

angular.module('cgAngularApp')
  .controller('TopnavCtrl', function ($scope, $rootScope, $state, Account) {
    $scope.showCollapsedNav = true;
    $scope.menuCollapsedClass = function(){
        return $scope.showCollapsedNav ? '' : 'collapsed';
    }
	$scope.toggleLaunchpad = function(){
		$rootScope.showContentBrowser = !$rootScope.showContentBrowser;
	};
	$scope.logout = function(){
		Account.Logout();
		$state.go("login");
	};
	$rootScope.$watch("title", function(){
		$scope.title = $rootScope.title;
	});

  });
