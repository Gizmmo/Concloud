HR = new Meteor.Collection('hr');

Meteor.methods({
	HREntry : function (hrAttributes) {
		var user = Meteor.user();
		var hrData = HRData.find({});
		var hrInsertArray = new Array();
		hrData.forEach(function (field) {
				if(hrAttributes[field.fieldName]){
					var name = field.fieldName;
					var insertObject = {};
					insertObject[name] = hrAttributes[field.fieldName];
					hrInsertArray[hrInsertArray.length] = insertObject;
					
				}
		});

		var insertObject = {};
		for(var i = 0; i < hrInsertArray.length; i++){
			for(var name in hrInsertArray[i]){
				insertObject[name] = hrInsertArray[i][name];
			}
			
		}
		insertObject.userId = hrAttributes.userId;
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