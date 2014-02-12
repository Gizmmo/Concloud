Template.createContractModal.events({
	'click #createContract' : function (event) {
		clearBackground(event, "createContract");
	},
	'keypress' : function() {
		if(event.which === 13){
			clearBackground();
			createContract();
		}
	},
	
	'click #create-contract' : function () {
		createContract();
	}
});

function createContract(){
			var curUser = Meteor.user();
		var name = Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName
		var contract = {
			title: $('#create-title').val(),
			description: $('#create-description').val()
		};

			//Calls the newly created Project's path after creating
		Meteor.call('contract', contract, function (error, id) {
			if (error) {
                // display the error to the user
                throwError(error.reason);
                // if the error is that the post already exists, take us there
                if (error.error === 302){
                }
            } else {;
            }
        });
}