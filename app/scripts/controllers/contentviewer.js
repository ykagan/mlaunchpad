'use strict';

angular.module('cgAngularApp')
	.controller('ContentviewerCtrl', function ($scope, $sce,$state, $rootScope, item, Container, $logger, $timeout) {
		$scope.item = item;//Container.GetItem($scope.itemId);
		$scope.urlSafe = $sce.trustAsResourceUrl($scope.item.Url);
		$rootScope.title = $scope.item.Title;
		if(item.origin == 'next')
		{
			$scope.animShow = true;
			$timeout(function(scope){
				$scope.animShow = false;
				$scope.$apply();
			});
		}
		else if (item.origin == 'prev')
		{
			$scope.animAway = true;
			$timeout(function (scope) {
				$scope.animAway = false;
				$scope.$apply();
			});
		}
		var switchNextPrev = function()
		{
			var item = $scope.item;
			var children = [];
			if (item.ParentContainer) {
				children = item.ParentContainer.Children;
			}
			else {
				children = Container.Getcontainer(item.Container, item.Subcontainer, item.toc);
			}
			var index = -1;
			//find item in children array
			$.each(children, function (i, c) {
				if (c.Id == item.Id) {
					index = i;
				}
			});

			if (index == -1) {
				$logger.error("Item not found!");
			}

			return {
				item:children[index],
				nextItem: (children.length < index -1) ? null : children[index+1], //last item
				prevItem: (index == 0) ? null: children[index-1] //first item
			};

		};

		$scope.goPrev = function(){
			$scope.animShow = true;

			$timeout(function () {
				var prevItem = switchNextPrev().prevItem;
				prevItem.origin = 'prev';
				if (!prevItem) {
					$logger.warning("This is the first item in the chapter!");
				}
				else {
					$state.go('^.contentviewer', {container: prevItem.Subcontainer, item: prevItem.Id});
				}
			},500);
		};
		$scope.goNext = function() {
			$scope.animAway = true;

			$timeout(function(){
				var nextItem = switchNextPrev().nextItem;
				nextItem.origin = 'next';
				if (!nextItem) {
					$logger.warning("This is the last item in the chapter!");
				}
				else {
					$state.go('^.contentviewer', {container: nextItem.Subcontainer, item: nextItem.Id});
				}
			}, 500);



		};


	});
