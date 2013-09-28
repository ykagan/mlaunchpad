'use strict';

var jsonResultsAdapter = new breeze.JsonResultsAdapter({

	name: "edmunds",

	extractResults: function (data) {
		var results = data.results;
		if (!results) throw new Error("Unable to resolve 'results' property");
		// Parse only the make and model types
		return results && (results.makeHolder || results.modelHolder);
	},

	visitNode: function (node, parseContext, nodeContext) {
		// Make parser
		if (node.id && node.models) {
			// move 'node.models' links so 'models' can be empty array
			node.modelLinks = node.models;
			node.models = [];
			return { entityType: "Make"  }
		}

		// Model parser
		else if (node.id && node.makeId) {
			// move 'node.make' link so 'make' can be null reference
			node.makeLink = node.make;
			node.make = null;

			// flatten styles and sizes as comma-separated strings
			var styles = node.categories && node.categories["Vehicle Style"];
			node.vehicleStyles = styles && styles.join(", ");
			var sizes = node.categories && node.categories["Vehicle Size"];
			node.vehicleSizes = sizes && sizes.join(", ");

			return { entityType: "Model" };
		}
	}

});

angular.module('cgAngularApp')
  .factory('Getitemlist', function Getitemlist(logger, model) {

		//breeze magic
		breeze.config.initializeAdapterInstance("modelLibrary", "backingStore", true);
		var serviceName = "http://dev.dlap.bfwpub.com/dlap.ashx";



		var ds = new breeze.DataService({
			serviceName: serviceName,
			hasServerMetadata: false,
			useJsonp: true,
			jsonResultsAdapter: jsonResultsAdapter
		});

		var manager = new breeze.EntityManager({dataService: ds});

		model.initialize(manager.metadataStore);

		return getItemList;

		/*
		Args:
			itemid
			query
		*/
		function getItemList(entityid, args){

			var parameters = {
				cmd: "getitemlist",
				entityid: entityid
			};
			if(args.itemid)
			{
				parameters.itemid = args.itemid;
			}
			if(args.query)
			{
				paramters.query = args.query;
			}
			parameters = makeParameters(parameters);

			var query = breeze.EntityQuery
				.from("")
				.withParameters(parameters);
			return manager.executeQuery(query).then(returnResults);
		}

		function makeParameters(addlParameters) {
			var parameters = {
				"_format": "JSON",
				"_token": "^H^fFF^ochN|gsIIU63R9x2h2R96CWj1xB"//login token for AUTH
			};
			return breeze.core.extend(parameters, addlParameters);
		}

		function returnResults(data)
		{
			return data.results;
		}
  });
