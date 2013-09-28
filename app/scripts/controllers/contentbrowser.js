'use strict';

angular.module('cgAngularApp')
  .controller('ContentbrowserCtrl', function ($scope, $state, $stateParams, Container) {
        $scope.rootItems = function()
        {
            var rootItems = Container.Getcontainer("Launchpad", "", "syllabusfilter");

	        rootItems.$promise.then(function(){
			        //scan items
			        angular.forEach(rootItems, function (item, key) {
				        if (item.CanHaveChildren) {
					        item.State = 'closed';
				        }
				        else {
					        item.State = 'barren';
				        }
			        });
		        }
	        );

            return rootItems;
        }();


		var openNode = function (item) {

			if(item.ParentContainer == null)
			{
				item.ParentContainer = $scope.rootItems;
			}
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
						if (child.Level > 2) {
							child.isVisible = false;
						}
						else {
							child.isVisible = true;
						}
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
							$scope.$apply();
						}
						openParentItem(openItem.Parent);
					});
				};
				openParentItem($stateParams.item);
			});

		}

        $scope.toggleChapter = function(item)
        {
	        //loadContainer(item);
	        if(item.State == "closed")
            {
	            $state.go('main.contentviewer', {container: item.Id, item: $stateParams.item});
            }
	        else if(item.State == "open")
	        {
		        $state.go('main.contentviewer', {container: "", item: ""});
	        }
	        else{
		        $state.go('main.contentviewer', {container: "", item: item.Id});
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

  });
