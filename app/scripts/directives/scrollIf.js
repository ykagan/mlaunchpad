'use strict';

angular.module('cgAngularApp')
	.directive('scrollIf', function () {
		return function (scope, element, attributes) {
			setTimeout(function () {
				if (scope.$eval(attributes.scrollIf)) {
					var scrollContainer = $("html, body");
					if(attributes.scrollContainer)
					{
						scrollContainer = $("."+ attributes.scrollContainer);
					}
					$(scrollContainer).animate({
						scrollTop: element[0].offsetTop
					}, 0);

				}
			});
		}
	});