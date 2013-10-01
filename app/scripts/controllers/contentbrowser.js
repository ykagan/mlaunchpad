'use strict';

angular.module('cgAngularApp')
  .controller('ContentbrowserCtrl', function ($scope, $rootScope, $state, $stateParams, Container, rootItems) {
        //$scope.rootItems = Container.Getcontainer("Launchpad", "", "syllabusfilter");
		$scope.rootItems = rootItems;

		$scope.rootItems.$promise.then(function () {
	        //scan items
	        angular.forEach($scope.rootItems, function (item, key) {
		        if (item.CanHaveChildren) {
			        item.State = 'closed';
		        }
		        else {
			        item.State = 'barren';
		        }
	        });
		});



		var openNode = function (item) {
			if (item.State == "closed") {
				item.State = 'open';
			}
			else if (item.State == "open") {
				item.State = 'closed';
			}
		};

		var loadContainer = function(item)
		{
			if (item.State === 'closed') {
				var children = Container.Getcontainer(item.Container, item.Id, item.toc);

				children.$promise.then(function(){
					//scan children
					angular.forEach(children, function (child, key) {
						if (child.CanHaveChildren) {
							child.State = 'closed';
						}
						else {
							child.State = 'barren';
						}
						child.ParentContainer = item;
					});
					item.Children = children;
				});
				//close all root items
				angular.forEach($scope.rootItems, function (value, key) {
					if (value.State == "open") {
						value.State = 'closed';
					}

				});
				item.State = 'open';
			}
			else if (item.State == "open") {
				item.State = 'closed';

			}
		};

		if($stateParams.container)
		{
			var chapterItem = null;
			$scope.rootItems.$promise.then(function () {
				angular.forEach($scope.rootItems, function (item, key) {
					if (item.Id == $stateParams.container) {
						chapterItem = item;
					}
				});
				if (chapterItem) {
					loadContainer(chapterItem);
				}
			});

		}

		if($stateParams.item)
		{
			$scope.rootItems.$promise.then(function () {
				var openParentItem = function(parentId)
				{
					if(parentId == null || parentId == "PX_MULTIPART_LESSONS")
						return;

					var openItem = Container.GetItem(parentId);
					openItem.$promise.then(function () {
						if(openItem.State != "open")
						{
							openNode(openItem);
						}
						openParentItem(openItem.Parent);
					});
				};
				openParentItem($stateParams.item);
			});
			$rootScope.showContentBrowser = false;
		}

        $scope.toggleChapter = function(item)
        {
	        //loadContainer(item);
	        if(item.State == "closed")
            {
	            $state.go('^.contentviewer', {container: item.Id});
            }
	        else if(item.State == "open")
	        {
		        $state.go('^.contentviewer', {container: "", item: ""});
	        }
	        else{
		        $state.go('^.contentviewer', {container: "", item: item.Id});
	        }
        };

        $scope.clickNode = function(item)
        {
	        if (item.State != "barren")
	        {
	            openNode(item);
	        }
	        else
            {
	            $state.go('main.contentviewer', {container: item.ParentContainer.Id, item: item.Id});
            }
        }

		$scope.ItemIsVisible = function(item)
		{
			if(item.ParentItem == null || item.ParentItem == "PX_MULTIPART_LESSONS")
			{
				return true;
			}
			if(item.ParentItem.State == "open")
			{
				return $scope.ItemIsVisible(item.ParentItem);
			}

		}

  });
