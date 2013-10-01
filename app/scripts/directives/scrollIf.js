'use strict';

angular.module('cgAngularApp')
	.directive('scrollIf', function () {
		return function (scope, element, attributes) {
			var scrollContainer = $("html, body");
			if (attributes.scrollContainer) {
				scrollContainer = $("." + attributes.scrollContainer);
			}
//			setTimeout(function () {
//				if (scope.$eval(attributes.scrollIf)) {
//					$(scrollContainer).animate({
//						scrollTop: element[0].offsetTop
//					}, 1000);
//				}
//			});
			scope.$watch('item.State', function (newVal, oldVal) {
				if (oldVal=="closed" && newVal == "open") { //scope.$eval(attributes.scrollIf)
					setTimeout(function () {
						$(scrollContainer).animate({
							scrollTop: element[0].offsetTop - 50
						}, 1000);
					});
				}
			});
		}
	});