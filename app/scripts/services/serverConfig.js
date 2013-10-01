'use strict';

angular.module('cgAngularApp')
	.factory("$serverConfig", function() {
		var ServerConfig = {
			DlapServer: "http://dev.dlap.bfwpub.com/dlap.ashx",
			ImagePath: "http://www.worthpublishers.com",
			ContentPath: "http://lcl.worthpublishers.com/BrainHoney/Resource/",
			AgilixDisciplineId: "39768"
		};

		return ServerConfig;
	});

