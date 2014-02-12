// Fixture data 
if (Meteor.users.find().count() === 0) {
    var now = new Date().getTime();
    var time = new Date().getTime();

var options = {
            email : "travisscott301@gmail.com",
            password : 'password',
                //Profile is the object within the user that can
                //be freely edited by the user
            profile : {
                firstName : "Travis",
                lastName: "Scott",
                email: "travisscott301@gmail.com",
                userGroup : "Office Manager",
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

    var id = Accounts.createUser(options);
    Accounts.sendEnrollmentEmail(id);
}