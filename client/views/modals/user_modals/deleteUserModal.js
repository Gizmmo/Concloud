Template.deleteUserModal.events({
	'click #deleteUser' : function (event) {
		if($(event.target).attr('id')!=="delete-user"){
			clearBackground(event, "deleteUser");
		}
	},
	'keypress' : function(event) {
    if(event.which === 13){
	    deleteUser(event);
    }
  },

	'click #delete-user' : function (event) {
		deleteUser(event);
	}
});

function deleteUser(event){
	passedID = Session.get("userId");
    Meteor.users.remove({_id: passedID});
    clearBackground(event, "deleteUser")
    $("#deleteUser").modal("hide");
}