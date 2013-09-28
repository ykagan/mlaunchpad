'use strict';

angular.module('cgAngularApp')
  .factory('Container', function Container(Items, $rootScope, $cacheFactory) {
		var cache = $cacheFactory('Getcontainer');
		var GetItem = function (itemid) {
				var item = cache.get("GetItem_" + itemid);
				if (!item) {
					var item = Items.getitem({
						itemid: itemid,
						entityid: $rootScope.course.id
					});
					cache.put("GetItem_" + itemid, item);
				}
				return item;
			};
			var Getcontainer = function(container, subcontainer, toc){
				var query = "/meta-containers/meta-container='" + container + "' AND /meta-subcontainers/meta-subcontainerid='" + subcontainer + "'";
	            var items = cache.get("Getcontainer_" + query);
	            if(!items)
	            {
		            items = Items.getitems({
			            query: query,
			            entityid: $rootScope.course.id
		            });
		            items.$promise.then(function(){

			            //set up structure for convenience
			            angular.forEach(items, function(item){
				           item.Children = $.grep(items, function(child) {return child.Parent == item.Id});
				           //angular.forEach(item.Children, function(child){child.ParentItem = item});
			            });

			            //set levels and sequencing
			            var rootItems = $.grep(items, function (item) {return item.Parent == subcontainer || item.Parent == "PX_MULTIPART_LESSONS"});
			            var level = subcontainer.length ? 2 : 1;
			            var parentContainerItem = subcontainer.length ? GetItem(subcontainer) : null;
			            var setChildrenLevels = function(children, level, parent_sequence, parentItem)
			            {
				            if(children)
				            {
					            angular.forEach(children, function (child) {
						            child.Level = level;
						            child.Sequence = parent_sequence + child.Sequence;
						            child.ParentItem = parentItem;
						            setChildrenLevels(child.Children, level + 1, child.Sequence, child);
					            });
				            }
			            };
			            setChildrenLevels(rootItems, level, "", parentContainerItem);

			            items.sort(function (a, b) {
				            return ((a.Sequence < b.Sequence) ? -1 : ((a.Sequence > b.Sequence) ? 1 : 0));
			            });
			            angular.forEach(items, function(item)  {
				            item.$promise = {
					          then: function(callback){callback();}
				            };
				            cache.put("GetItem_" + item.Id, item);
			            });
		            });
		            cache.put("Getcontainer_" + query, items);
	            }

	            return items;
            };
			return  {
				GetItem: GetItem,
				Getcontainer: Getcontainer
	        }
    });
