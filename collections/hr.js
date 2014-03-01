HR = new Meteor.Collection('hr');

Meteor.methods({
	HREntry : function (hrAttributes) {
		var user = Meteor.user();
		var hrData = HRData.find({});
		var hrInsertArray = new Array();
		console.log("Hello");
		hrData.forEach(function (field) {
				if(hrAttributes[field.fieldName]){
					var name = field.fieldName;
					var value = hrAttributes[field.fieldName];
					var insertObject = {};
					insertObject["name"] = name;
					insertObject["value"] = value;
					hrInsertArray[hrInsertArray.length] = insertObject;
				} else {
					var name = field.fieldName;
					var value = field.defaultValue;;
					var insertObject = {};
					insertObject["name"] = name;
					insertObject["value"] = value;
					hrInsertArray[hrInsertArray.length] = insertObject;
				}
		});

		var insertObject = {};
		insertObject.userId = hrAttributes.userId;
		insertObject.hrValues = hrInsertArray;
		HR.insert(insertObject);
	},

	HRUpdate : function (hrAttributes){
		HR.update({"userId" : hrAttributes.userId}, hrAttributes);
	},

	HRDelete : function (userId){
		HR.remove({"userId": userId});
	},

	HRAdd : function(hrAttributes, newAttribute){
		HR.update({userId : hrAttributes.userId}, {$set: newAttribute});
	}
});