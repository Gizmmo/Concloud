Template.createNewUserModal.events({

    'click #createData' : function (event) {
        if($(event.target).attr('id')!=="create-user"){
            clearBackground(event, "createData");
        }
    },

    'keypress' : function(event) {
        if(event.which === 13){
          createNewUser(event);
        }
    },
		/**
	 * Creates a projects and inserts it in the project collection
	 * @param  Event event The event of clicking the button
	 * @return void
	 */
	 'click #create-user': function (event) {
        createNewUser(event);
        $('#email').val("");
        $('#first-create-name').val("");
        $('#last-create-name').val("");
    }
});

function createNewUser(event){
        var time = new Date().getTime();
        var options = {
            email : $('#email').val(),
            password : 'password',
                //Profile is the object within the user that can
                //be freely edited by the user
                profile : {
                    firstName : capitalizeFirstLetter($('#first-create-name').val()),
                    lastName: capitalizeFirstLetter($('#last-create-name').val()),
                    email: $("#email").val().toLowerCase(),
                    userGroup : capitalizeFirstLetter($('#user-create-group').val()),
                    joinDate: time,
                    recent: {
                        lastLogin: time,
                        lastProjectName: "None",
                        lastProjectID: "None"
                    }
                }
            }
        Meteor.call('createNewUser', options, function (error, id) {
            if(error){

            }else {
                Meteor.call("HREntry", {userId: id}, function (error, id){});
            }
        });
        $("#search-field").val("");
        clearBackground(event, "createData");
}