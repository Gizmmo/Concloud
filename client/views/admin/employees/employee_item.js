Template.employeeItem.helpers({
	convertedTime: function () {
		return formatDate(this.profile.recent.lastLogin);
	}
});