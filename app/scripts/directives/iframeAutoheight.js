'use strict';

angular.module('cgAngularApp')
	.directive('iframeAutoheight', function ($timeout) {
		return function (scope, element, attributes) {
			var iframe = $(element[0]);
			$timeout(function(scope){
				$(iframe).iframeHeight({
					blockCrossDomain: true,
					watcher:true,
					watcherTime:400,
					resizeMaxTry:4,
					resizeWaitTime:50,
					defaultHeight: $(window).height() - 100,
					minimumHeight: $(window).height() - 100,
					heightOffset: 20
				}, 1000);
			});
		}
	});