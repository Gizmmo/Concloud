Template.signInModal.rendered = function () {
   $('#myModal').on('shown.bs.modal', function () {
	   $("#incorrect-log-label").text("");
	   $("#incorrect-email-label").text("");
	   $('#email').val("");
	   $('#passwd').val("");
	   $('#find-email').val("");
	});
};

Template.signInModal.events({
/**
 * If a user presses enter while on a subfield when signing up
 * they will submit the form.  This is done as there is already
 * another form on this page, so we cant call submit form
 * @param  Event event The event that is happening
 * @return void
 */
 'keypress .onSub': function (event) {
		//This will stop the default submitting of the form
		if(event.which === 13){
			logIn();
		}
	},

	 'keypress #find-email': function (event) {
		//This will stop the default submitting of the form
		if(event.which === 13){
			forgotPass();
		}
	},

	'click .returnLogin': function (e) {
		$("#incorrect-log-label").text("");
	   	$("#incorrect-email-label").text("");
	   	$('#email').val("");
	   	$('#passwd').val("");
	   	$('#find-email').val("");
		changeModal('.logInModal');
		e.preventDefault();

	},

	'click .close-me' : function (e) {
		e.preventDefault();
		$("#incorrect-log-label").text("");
	   	$("#incorrect-email-label").text("");
	   	$('#email').val("");
	   	$('#passwd').val("");
	   	$('#find-email').val("");

		$('#myModal').modal('hide');
		changeModal('.logInModal');
	},

	'click .newPass': function (e) {
		$("#incorrect-log-label").text("");
	   	$("#incorrect-email-label").text("");
	   	$('#email').val("");
	   	$('#passwd').val("");
	   	$('#find-email').val("");
		changeModal('.newPassModal');
		e.preventDefault();

	},
	//This event will run when the user clicks the
	//log in button
	'click #logButton': function () {
		logIn();
	},
	//This is the event to handle if the user clicks
	//that they have forgotten their password
	'click #forgot-btn': function (){
		forgotPass();
	}

});

/**
 * Changes the Modal with a fadeOut/fadeIn effect from one modal to another.
 * @param  {[String]} newValue [The selector for the new Model]
 */
 var changeModal = function (newValue){
	$newForm = $(newValue);
		//The Modal Wrapper (Includes all forms);
		var $form_wrapper = $('#myModal'),

		//The current form is the one with class 'active'
		$currentForm = $form_wrapper.children('.active');

		$currentForm.fadeOut('400', function() {
			//remove class "active" from current form
			$currentForm.removeClass('active');

			//animate the wrapper
			$form_wrapper.stop()
			.animate({
				width: $newForm.data('500') + 'px',
				height: $newForm.data('500') + 'px'

			},500,function(){
								//new form gets class "active"
								$newForm.addClass('active');
								//show the new form
								$newForm.fadeIn(400);
							});

		});
	};

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
					    $('#myModal').modal('hide');
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
						$('#myModal').modal('hide');
					}
				});
			} else {
				$("#incorrect-email-label").text("Please enter an email address.");
			}
	}
