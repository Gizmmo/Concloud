Template.userCreate.events({
	/**
	 * Creates a projects and inserts it in the project collection
	 * @param  Event event The event of clicking the button
	 * @return void
	 */
	'submit form': function (event) {
		//This will stop the default submitting of the form
		event.preventDefault();

		var time = new Date().getTime();
		var options = {
			email : $('#email').val(),
			password : 'password',
                //Profile is the object within the user that can
                //be freely edited by the user
            profile : {
				firstName : capitalizeFirstLetter($('#first-name').val()),
				lastName: capitalizeFirstLetter($('#last-name').val()),
				email: $("#email").val().toLowerCase(),
				userGroup : capitalizeFirstLetter($('#user-group').val()),
				joinDate: time,
				recent: {
					lastLogin: time,
					lastProjectName: "None",
					lastProjectID: "None"
					},
                }
            }

        Meteor.call('createNewUser', options, function (error, id) {
        	if (error) {
             	// display the error to the user
                // if the error is that the post already exists, take us there
                if (error.error === 302){
        			Router.go('userPage', error.details);
                }
            } else {
                Meteor.call("HREntry", {}, function (error, id){});
                options._id = id;
        		Router.go('userPage', options);
            }
    	});

	}
});