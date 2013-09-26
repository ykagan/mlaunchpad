'use strict';

angular.module('cgAngularApp')
  .controller('ContentbrowserCtrl', function ($scope, $state, $stateParams, Container) {
        $scope.rootItems = function()
        {
            var rootItems = Container.Getcontainer("Launchpad", "PX_MULTIPART_LESSONS", "syllabusfilter");

            //scan items
            angular.forEach(rootItems, function(item, key)
            {
	            if (item.CanHaveChildren) {
	                item.State = 'closed';
	            }
	            else {
	                item.State = 'barren';
	            }
            });
            return rootItems;
        }();


		var openNode = function (item) {

			if(item.ParentContainer != null)
			{
				var allChildren = item.ParentContainer.Children;
				if (item.State == "closed") {
					angular.forEach(allChildren, function (value, key) {
						if (value.Parent == item.Id) {
							value.isVisible = true;
						}
					});
					item.State = 'open';
				}
				else if (item.State == "open") {
					angular.forEach(allChildren, function (value, key) {
						if (value.Parent == item.Id) {
							value.isVisible = false;
						}
					});
					item.State = 'closed';
				}
			}
		};
		var loadContainer = function(item)
		{
			if (item.State === 'closed') {
				var children = Container.Getcontainer(item.Container, item.Id, item.toc);

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
			angular.forEach($scope.rootItems, function(item, key)
			{
				if(item.Id == $stateParams.container)
				{
					chapterItem = item;
				}
			});
			if(chapterItem)
			{
				loadContainer(chapterItem);
			}
		}
		if($stateParams.item)
		{
			var openItem = Container.GetItem($stateParams.item);

			while(openItem != null)
			{
				openNode(openItem);
				openItem = Container.GetItem(openItem.Parent);
			}

		}


        $scope.toggleChapter = function(item)
        {
	        //loadContainer(item);
	        if(item.State != "barren")
            {
	            $state.go('main.contentviewer', {container: item.Id, item: $stateParams.item});
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
