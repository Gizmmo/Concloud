// Fixture data
if (Meteor.users.find().count() === 0) {
    var now = new Date().getTime();
    var time = new Date().getTime();

    var options = {
        email : "travisscott301@gmail.com",
        password : 'concloudSuper',
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
                    }
                }
    }

        var id = Accounts.createUser(options);
        Meteor.call("HREntry", {userId: id}, function (error, id){});
        Accounts.sendEnrollmentEmail(id);

    options = {
        email : "super@concordprojects.com",
        password : 'password',
                //Profile is the object within the user that can
                //be freely edited by the user
                profile : {
                    firstName : "Super",
                    lastName: "Admin",
                    email: "super@concordprojects.com",
                    userGroup : "Admin",
                    joinDate: time,
                    recent: {
                        lastLogin: time,
                        lastProjectName: "None",
                        lastProjectID: "None"
                    }
                }
    }

    var id = Accounts.createUser(options);
}

    if(DefaultFolders.find().count() === 0){
        var folder = {};
        createFolder("Change Orders", ["Office Manager", "Employee", "Client"]);
        createFolder("Consultant", ["Office Manager", "Employee", "Client"]);
        createFolder("Contracts and PO's", ["Office Manager", "Employee", "Client"]);
        createFolder("Daily Log's", ["Office Manager", "Employee", "Client"]);
        createFolder("Drawings", ["Office Manager", "Employee", "Client"]);
        createFolder("Estimates", ["Office Manager", "Employee", "Client"]);
        createFolder("Inspections, Reports & Tests", ["Office Manager", "Employee", "Client"]);
        createFolder("Legal, Civic & Utility", ["Office Manager", "Employee", "Client"]);
        createFolder("Minutes of Meetings", ["Office Manager", "Employee", "Client"]);
        createFolder("Owner", ["Office Manager", "Employee", "Client"]);
        createFolder("PCN's", ["Office Manager", "Employee", "Client"]);
        createFolder("Pictures", ["Office Manager", "Employee", "Client"]);
        createFolder("Preliminary", ["Office Manager", "Employee", "Client"]);
        createFolder("Safety", ["Office Manager", "Employee", "Client"]);
        createFolder("Shop Drawings", ["Office Manager", "Employee", "Client"]);
        createFolder("Subtrades", ["Office Manager", "Employee", "Client", "Sub-Trade"]);

    }

    function createFolder(name, permissions) {
        folder["name"]=name;
        folder["permissions"] = permissions;
        DefaultFolders.insert(folder);
    }