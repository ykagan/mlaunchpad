'use strict';

angular.module('cgAngularApp')
  .controller('LoginCtrl', function ($scope, $location, Account) {
    $scope.user = {
        username: "",
        password: ""
    };
    $scope.login = function ()
    {
        var authSuccessful = Account.Auth($scope.user.username, $scope.user.password);
        if(authSuccessful)
        {
            alert("success!");
            $location.path('/');
        }

    }
  });
