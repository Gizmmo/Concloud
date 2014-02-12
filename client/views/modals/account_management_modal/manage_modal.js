Template.manageModal.events({
	'click #updatePass' : function (event) {
		clearBackground(event, "updatePass");
	},
	'keypress' : function() {
		if(event.which === 13){
			changePass();
		}
	},

	'click #update-password': function () {
		changePass();
	}
});

function changePass(){
		var oldPass = $('#old-password').val();
		var newPass = $('#sign-password').val();
		var confimPass = $('#sign-confirm-password').val();
		if(newPass === confimPass && newPass.length > 0){
			Accounts.changePassword(oldPass, newPass, function (error){
				if(error){
					$("#incorrect-label").text("You either entered an incorrect old password, or there was an internal error");
				} else {
					$("#updatePass").modal("hide");
					$('.modal-backdrop').remove();

				}
			});
		} else {
			$("#not-match-label").text("Passwords did not match");
		}
}

Template.manageModal.created = function() {
	$('#old-password').val("");
	$('#sign-password').val("");
	$('#sign-confirm-password').val("");
	$("#incorrect-label").text("");
	$("#not-match-label").text("");
}