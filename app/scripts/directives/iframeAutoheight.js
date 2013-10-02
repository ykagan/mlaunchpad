'use strict';

angular.module('cgAngularApp')
	.directive('iframeAutoheight', function () {
		return function (scope, element, attributes) {
			var iframe = $(element[0]);
			scope.$evalAsync(function(scope){
				$(iframe).iframeHeight({
					blockCrossDomain: false,
					watcher:true,
					watcherTime:400,
					resizeMaxTry:10,
					resizeWaitTime:50
				});
			});
		}
	});