Template.userList.helpers({
	/**
	 * Finds all projects
	 * @return collection All projects in collection
	 */
	users: function() {
		return Meteor.users.find({}).fetch();
	}
});

