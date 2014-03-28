Template.changepassword.events({
	'click #update-password': function (event) {
		changePass(event);
	}
});



Template.changepassword.created = function() {
	$('#old-password').val("");
	$('#sign-password').val("");
	$('#sign-confirm-password').val("");
	$("#incorrect-label").text("");
	$("#not-match-label").text("");
};

function changePass(event){
		var oldPass = $('#old-password').val();
		var newPass = $('#sign-password').val();
		var confimPass = $('#sign-confirm-password').val();
		if(newPass === confimPass && newPass.length > 0){
			Accounts.changePassword(oldPass, newPass, function (error){
				if(error){
					$("#incorrect-label").text("You either entered an incorrect old password, or there was an internal error");
					$('.passwordError').toggle();
				} else {
					Router.go("dashboard");

				}
			});
		} else {
			$("#incorrect-label").text("Passwords did not match");
			$('.passwordError').toggle();
		}
}