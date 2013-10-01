'use strict';

angular.module('cgAngularApp')
	.factory('Items', function Items($resource, $logger, $serverConfig) {
		var parseDlapItems = function (data)
		{
			if (data.response.code == "OK") {
				var items = data.response.items.item;
				angular.forEach(items, function (item) {
					var imgNode = $.grep(item.data.bfw_properties.bfw_property, function (p) {
						return p.name == "thumbnail"
					});
					var img = "";
					if (imgNode.length)
						img = imgNode[0].$value;
					var containerNode = $.grep(item.data["meta-containers"]["meta-container"], function (s) {
						return s.toc == "syllabusfilter"
					})[0];
					var subcontainerNode = $.grep(item.data["meta-subcontainers"]["meta-subcontainerid"], function (s) {
						return s.toc == "syllabusfilter"
					})[0];
					angular.extend(item, {
						Id: item.id,
						Title: item.data.title.$value,
						Description: item.data.description ? item.data.description.$value : "",
						ImageUrl: $serverConfig.ImagePath + img,
						Toc: "syllabusfilter",
						Container: containerNode ? containerNode.$value : "",
						Subcontainer: subcontainerNode ? subcontainerNode.$value : "",
						Parent: item.data.bfw_tocs.syllabusfilter.parentid,
						Sequence: item.data.bfw_tocs.syllabusfilter.sequence,
						Children: [],
						CanHaveChildren: item.data.bfw_type.$value == "PxUnit",
						Url: $serverConfig.ContentPath + (item.data.href ?
							item.data.href.entityid ? item.data.href.entityid : $serverConfig.AgilixDisciplineId
								+ "/" + item.data.href.$value : "")
					});
				});
				$logger.log(data);
				return data.response.items.item;
			}
		};
		var parseDlapItem = function(data)
		{
			return parseDlapItems(data)[0];
		};
		var Items = $resource(
			$serverConfig.DlapServer,
			{
				_format:'json',
				_callback:'JSON_CALLBACK',
				entityid: '@entityid'
			},
			{
				getitems:{
					method:'JSONP',
					cache: true,
					params:{
						cmd:'getitemlist',
						query:'@query'
					},
					isArray: true,
					transformResponse: parseDlapItems
				},
				getitem:{
					method: 'JSONP',
					cache: true,
					params: {
						cmd: 'getitemlist',
						itemid: '@itemid'
					},
					transformResponse: parseDlapItem
				},
				putitems:{
					method: 'JSONP',
					params: {
						cmd: 'putitems',
						itemid: '@itemid'
					},
					isArray:true,
					transformRequest: function(data, headersGetter){
						$logger.log("transform here")
					}
				}
			});

			return Items;
	});