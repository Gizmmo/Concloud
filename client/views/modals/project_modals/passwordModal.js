Template.passwordModal.events({
	'click #passwordModal' : function (event) {
		if($(event.target).attr('id')!=="enter-password"){
			clearBackground(event, "passwordModal");
		}
	},
	'keypress' : function(event) {
    if(event.which === 13){
    	acceptPasswords(event);
    }
  },

	'click #enter-password' : function () {
		acceptPasswords();
	}
});

function acceptPasswords(event){
	$("#incorrect-pass-label").text("");
	data = {
		_id: Session.get('projectId'),
		password: $("#project-password").val()
	}
	var returnValue;
	Meteor.call('checkPassword', data, function(error, result){
		if(result){
			if(event){
				clearBackground(event, "passwordModal");
			}
			$("#passwordModal").modal("hide");
			Router.go('projectPage', {"_id": data._id});
		} else {
			$("#incorrect-pass-label").text("Incorrect Password.  Please Try Again.");
		}
	});
}