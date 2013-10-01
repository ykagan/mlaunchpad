'use strict';

angular.module('cgAngularApp')
  .controller('LoginCtrl', function ($scope, $state, Account) {
    $scope.user = {
        username: "",
        password: ""
    };
	$scope.loading = false;
    $scope.login = function ()
    {
	    $scope.loading = true;
        var User = Account.Auth($scope.user.username, $scope.user.password);
	    User.then(function(data){
		    $scope.loading = false;
		    if (Account.isLoggedIn()) {
			    $state.go('main.contentbrowser');
		    }
		});

    }

	if(Account.isLoggedIn())
	{
		$state.go('main.contentbrowser');
	}
  });
