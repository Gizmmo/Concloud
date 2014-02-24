Template.updateUserModal.events({
	'click #updateData' : function (event) {
		if($(event.target).attr('id')!=="enter-password"){
			clearBackground(event, "updateData");
		}
	},
	'keypress' : function(event) {
        if(event.which === 13){
          clearBackground();
          updateUser(event);
        }
    },
	'click #update-user': function (event) {
		updateUser(event);
	}
});

function updateUser(event){
		var firstName = $("#first-name").val();
		var lastName = $("#last-name").val();
		var userGroup = $("#user-group").val();
		Meteor.users.update({_id: clickedID}, {$set:{"profile.firstName": firstName, "profile.lastName": lastName, "profile.userGroup": userGroup}})
		clearBackground(event, "updateData");

}