Template.createNewUserModal.events({

    'click #createData' : function (event) {
        clearBackground(event, "createData");
    },

    'keypress' : function() {
        if(event.which === 13){
          clearBackground();
          createNewUser();
        }
    },
		/**
	 * Creates a projects and inserts it in the project collection
	 * @param  Event event The event of clicking the button
	 * @return void
	 */
	 'click #create-user': function (event) {
        createNewUser();
        $('#email').val("");
        $('#first-create-name').val("");
        $('#last-create-name').val("");
    }
});

function createNewUser(){
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
                    },
                    hr : {
                        sickDays: 0,
                        vacationDays: 0,
                    //Updates in an arryay conataining update objects
                    //that contain a value, and how it has changed
                    updates : [{
                        hrValue: "User",
                        valueChanged: "Was Created"
                    }]
                }
            }
        };
        Meteor.call('createNewUser', options, function (error, id) {
        });
        $("#search-field").val("");


    }