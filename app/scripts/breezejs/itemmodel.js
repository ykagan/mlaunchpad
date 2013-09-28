angular.module('cgAngularApp')
	.factory('itemModel', function () {
		var DT = breeze.DataType;
		return {
			initialize: initialize
		};

		function initialize(metadataStore) {
			metadataStore.addEntityType({
				shortName: "Item",
				namespace: "Agilix",
				dataProperties: {
					id: { dataType: DT.Int64, isPartOfKey: true },
					name: { dataType: DT.String },
					niceName: { dataType: DT.String },
					modelLinks: { dataType: DT.Undefined }
				},
				navigationProperties: {
					models: {
						entityTypeName: "Model:#Edmunds", isScalar: false,
						associationName: "Make_Models"
					}
				}
			});
		}


	});
