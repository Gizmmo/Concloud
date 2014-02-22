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

    if(Folders.find().count() === 0){
        var folder = {};
        createFolder("Change Orders", ["Office Manager", "Admin", "Employee", "Client"]);
        createFolder("Consultant", ["Office Manager", "Admin", "Employee", "Client"]);
        createFolder("Contracts and PO's", ["Office Manager", "Admin", "Employee", "Client"]);
        createFolder("Daily Log's", ["Office Manager", "Admin", "Employee", "Client"]);
        createFolder("Drawings", ["Office Manager", "Admin", "Employee", "Client"]);
        createFolder("Estimates", ["Office Manager", "Admin", "Employee", "Client"]);
        createFolder("Inspections, Reports & Tests", ["Office Manager", "Admin", "Employee", "Client"]);
        createFolder("Legal, Civic & Utility", ["Office Manager", "Admin", "Employee", "Client"]);
        createFolder("Minutes of Meetings", ["Office Manager", "Admin", "Employee", "Client"]);
        createFolder("Owner", ["Office Manager", "Admin", "Employee", "Client"]);
        createFolder("PCN's", ["Office Manager", "Admin", "Employee", "Client"]);
        createFolder("Pictures", ["Office Manager", "Admin", "Employee", "Client"]);
        createFolder("Preliminary", ["Office Manager", "Admin", "Employee", "Client"]);
        createFolder("Safety", ["Office Manager", "Admin", "Employee", "Client"]);
        createFolder("Shop Drawings", ["Office Manager", "Admin", "Employee", "Client"]);
        createFolder("Subtrades", ["Office Manager", "Admin", "Employee", "Client", "Subtrades"]);

    }

    function createFolder(name, permissions) {
        folder["name"]=name;
        folder["permissions"] = permissions;
        Folders.insert(folder);
    }