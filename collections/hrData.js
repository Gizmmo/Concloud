HRData = new Meteor.Collection('hrData');

Meteor.methods({
	HRField: function (newEntry) {
		if(!HRData.findOne({fieldName: newEntry.fieldName})){
			var user = Meteor.user();
			var entry = _.extend(_.pick(newEntry, 'fieldName', 'defaultValue'), {
				createdOn: new Date().getTime(),
				createdById: user._id,
				createdBy: user.profile.firstName + " " + user.profile.lastName
			});

			var projectID = HRData.insert(entry);

			hrFound = HR.find({});
			var name = entry.fieldName;
			var value = entry.defaultValue;
			var insertObject = {};
			insertObject["name"] = name;
			insertObject["value"] = value;
			hrFound.forEach(function (post) {
				HR.update({userId: post.userId}, {$addToSet: {hrValues: insertObject}});
			});

			return projectID;
		} else {
			throw new Meteor.Error(403, "This Field already exists");
		}
	},

	HRFieldUpdate: function (newEntry) {
			var user = Meteor.user();
			var entry = _.extend(_.pick(newEntry, 'fieldName', 'defaultValue'), {
			createdOn: new Date().getTime(),
			createdBy: user._id
		});

		var entryID = HRData.update({"_id" : newEntry._id}, newEntry);

		return entryID;
	},

	HRFieldRemove: function (deleteEntry) {
		var fieldName = deleteEntry.fieldName;
		HRData.remove({"_id" : deleteEntry._id});

		hrFound = HR.find({});
		hrFound.forEach(function (post) {
			for(var i = 0; i < post.hrValues.length; i++){
				if(post.hrValues[i].name === fieldName){
					post.hrValues.splice(i,1);
				}
			}
			HR.update({userId: post.userId}, post);
		});
	}
});