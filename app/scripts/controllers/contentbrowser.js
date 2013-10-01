'use strict';

angular.module('cgAngularApp')
  .controller('ContentbrowserCtrl', function ($scope, $rootScope, $state, Container, rootItems) {
	    angular.forEach(rootItems, function (item, key) {
	        if (item.CanHaveChildren) {
		        item.State = 'closed';
	        }
	        else {
		        item.State = 'barren';
	        }
	    });

		$scope.rootItems = rootItems;

		//opens subcontainer to currently open item from content viewer
		var checkItemParam = function (subcontainer) {
			if ($state.params.item) {
				var openParentItem = function (parentId) {
					if (parentId == null || parentId == "PX_MULTIPART_LESSONS")
						return;

					var openItem = Container.GetItem(parentId);
					if (openItem.Subcontainer == subcontainer) {
						if (openItem.State == "closed") {
							openNode(openItem);
						}
						openParentItem(openItem.Parent);
					}
				};
				openParentItem($state.params.item);

			}
		};


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
					checkItemParam(item.Id);
					item.Children = children;
				});
				//close all root items
				angular.forEach($scope.rootItems, function (value, key) {
					if (value.State == "open") {
						value.State = 'closed';
					}

				});
				item.State = 'open';
				$scope.currentContainer = item;
			}
			else if (item.State == "open") {
				item.State = 'closed';

			}
		};

		//update selected item on state change
		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			if ($scope.currentContainer) {
				checkItemParam($scope.currentContainer.Id);
			}

		});

		if($state.params.container)
		{
			var chapterItem = null;
			angular.forEach($scope.rootItems, function (item, key) {
				if (item.Id == $state.params.container) {
					chapterItem = item;
				}
			});
			if (chapterItem) {
				loadContainer(chapterItem);
			}
		}


/* Item-level functions */
        $scope.toggleChapter = function(item)
        {
	        if(item.State == "closed")
            {
	            loadContainer(item);
            }
	        else if(item.State == "open")
	        {
		        openNode(item);
	        }
	        else{

		        $rootScope.showContentBrowser = false;
		        $state.go('main.contentbrowser.contentviewer', {container: "", item: item.Id});
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
	            $rootScope.showContentBrowser = false;
		        $state.go('main.contentbrowser.contentviewer', {container: item.ParentContainer.Id, item: item.Id});
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
/* END Item-level functions */


  });
