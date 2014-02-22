HRData = new Meteor.Collection('hrData');

Meteor.methods({
	HRField: function (newEntry) {
		console.log("inside");
		var user = Meteor.user();
		var entry = _.extend(_.pick(newEntry, 'fieldName', 'defaultValue'), {
			createdOn: new Date().getTime(),
			createdBy: user._id
		});

		var projectID = HRData.insert(entry);

		return projectID;
	}
});