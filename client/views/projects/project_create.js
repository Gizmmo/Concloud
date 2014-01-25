Template.projectCreate.events({
	/**
	 * Creates a projects and inserts it in the project collection
	 * @param  Event event The event of clicking the button
	 * @return void
	 */
	'submit form': function (event) {
		//This will stop the default submitting of the form
		event.preventDefault();
		

		//Calls the newly created Project's path after creating
		Meteor.call('project', project, function (error, id) {
			if (error) {
                // display the error to the user
                throwError(error.reason);
                // if the error is that the post already exists, take us there
                if (error.error === 302){
			Router.go('projectPage', error.details);
                }
            } else {
                //no errors send to the new page
                project._id = id;
				Router.go('projectPage', project);
            }
        });

	}
});
