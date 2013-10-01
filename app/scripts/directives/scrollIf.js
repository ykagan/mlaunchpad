'use strict';

angular.module('cgAngularApp')
	.directive('scrollIf', function ($timeout) {
		return function (scope, element, attributes) {
			var scrollContainer = $("html, body");
			if (attributes.scrollContainer) {
				scrollContainer = $("." + attributes.scrollContainer);
			}
			scope.$watch('item.State', function (newVal, oldVal) {
				if (scope.$eval(attributes.scrollIf)) { //oldVal=="closed" && newVal == "open"
					$timeout(function () {
						$(scrollContainer).animate({
							scrollTop: element[0].offsetTop -10
						}, 500);
					}, 700);
				}
			});
		}
	});