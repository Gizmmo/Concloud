Template.manageModal.events({
	'click #update-password': function () {
		var oldPass = $('#old-password').val();
		var newPass = $('#sign-password').val();
		var confimPass = $('#sign-confirm-password').val();
		if(newPass === confimPass){
			Accounts.changePassword(oldPass, newPass, function (error){
				if(error){
					console.log("You either entered an incorrect old password, or there was an internal error");
				} else {
					console.log("Your password was changed successfully!");
				}
			});
		} else {
			console.log("Passwords did not match");
			//Fill in Error code here
		}
	}
});