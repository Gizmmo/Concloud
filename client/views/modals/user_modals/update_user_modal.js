Template.updateUserModal.events({
	'click #update-user': function () {
		var firstName = $("#first-name").val();
		var lastName = $("#last-name").val();
		var userGroup = $("#user-group").val();
		Meteor.users.update({_id: clickedID}, {$set:{"profile.firstName": firstName, "profile.lastName": lastName, "profile.userGroup": userGroup}})
	}
});