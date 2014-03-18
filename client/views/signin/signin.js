Template.signin.events({
	 'keypress .onSub': function (event) {
		//This will stop the default submitting of the form
		if(event.which === 13){
			logIn(event);
		}
	},

	//This event will run when the user clicks the
	//log in button
	'click #logButton': function (event) {
		event.preventDefault();
		logIn();
	},

});


	/**
	 * Used to log in
	 * @return null
	 */
	function logIn() {
		var user =  $('#email').val();
		var password = $('#passwd').val();
		if(user.length != 0){
			if(password.length !=0){
				Meteor.loginWithPassword(user, password, function (error) {
					if(error){
						$("#incorrect-log-label").text("Incorrect Username or Password");
					} else{
						//Fill In LogIn Code
					    $('body').css("height", "auto");
					    Router.go('dashboard');
					}
				});
			}else{
				$("#incorrect-log-label").text("Please Fill in Password Field");
			}
		} else{
			$("#incorrect-log-label").text("Please Fill in a User Name Field");
		}
	}