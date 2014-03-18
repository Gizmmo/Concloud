Template.forgot.events({
	//This is the event to handle if the user clicks
	//that they have forgotten their password
	'click #forgot-btn': function (){
		forgotPass();
	},

	'keypress #find-email': function (event) {
		//This will stop the default submitting of the form
		if(event.which === 13){
			forgotPass();
		}
	},
});

function forgotPass() {
		foundEmail = $('#find-email').val();
		if(foundEmail.length != 0){
			var options = {
				email:foundEmail
			}
				Accounts.forgotPassword(options, function (error) {
					if(error){
						$("#incorrect-email-label").text("Given email was not found in our records");
					}else{
						Router.go("signin");
					}
				});
			} else {
				$("#incorrect-email-label").text("Please enter an email address.");
			}
	}