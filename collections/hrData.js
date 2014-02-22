HRData = new Meteor.Collection('hrData');

Meteor.methods({
	HRField: function (newEntry) {
		var user = Meteor.user();
		var entry = _.extend(_.pick(newEntry, 'fieldName', 'defaultValue'), {
			createdOn: new Date().getTime(),
			createdBy: user._id
		});

		var projectID = HRData.insert(entry);

		hrFound = HR.find({});
		var insertObject = {};
		insertObject[entry.fieldName] = entry.defaultValue;
		hrFound.forEach(function (post) {
			HR.update({userId: post.userId}, {$set: insertObject});
		});

		return projectID;
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

	HRFieldDelete: function (entryID) {
		var fieldName = HRData.findOne({"_id" : entryID}).fieldName;
		HRData.remove({"_id" : entryID});

		hrFound = HR.find({});
		hrFound.forEach(function (post) {
			delete post[fieldName]; //LAST EDITING HERE
			HR.update({userId: post.userId}, post);
		});
	}
});