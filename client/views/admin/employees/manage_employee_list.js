Template.manageEmployeeList.helpers({
	/**
	 * Finds all projects
	 * @return collection All projects in collection
	 */
	employees: function() {
		return Meteor.users.find({"profile.userGroup" : "Employee"}).fetch();
	}
});

