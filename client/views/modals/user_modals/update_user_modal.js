Template.updateUserModal.events({
	'click #updateData' : function (event) {
		clearBackground(event, "updateData");
	},
	'keypress' : function() {
        if(event.which === 13){
          clearBackground();
          updateUser();
        }
    },
	'click #update-user': function () {
		updateUser();
	}
});

function updateUser(){
		var firstName = $("#first-name").val();
		var lastName = $("#last-name").val();
		var userGroup = $("#user-group").val();
		Meteor.users.update({_id: clickedID}, {$set:{"profile.firstName": firstName, "profile.lastName": lastName, "profile.userGroup": userGroup}})
	
}