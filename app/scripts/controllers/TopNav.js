'use strict';

angular.module('cgAngularApp')
  .controller('TopnavCtrl', function ($scope) {
    $scope.showCollapsedNav = true;
    $scope.menuCollapsedClass = function(){
        return $scope.showCollapsedNav ? '' : 'collapsed';
    }
  });
