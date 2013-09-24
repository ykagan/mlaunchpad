'use strict';

angular.module('cgAngularApp')
  .controller('MainCtrl', function ($scope) {
        var mainViewModes =
        {
            ContentView: "ContentView",
            ContentBrowser: "ContentBrowser"
        }
        $scope.mode = mainViewModes.ContentBrowser;
  });
