// Fixture data 
if (Projects.find().count() === 0) {
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
                userGroup : "Admin",
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

//Insert fake project data
    Projects.insert({
        title: 'Concloud Project',
        authorName: "Travis Scott",
        description: "A terrific web app made by a terrific man",
        authorID: 'BXizcEzSJXB33rNir',
        submitted: now,
        updates: [{
            updateDate: new Date().getTime(),
            updateAuthorName: "Travis Scott",
            updateAuthorID: "BXizcEzSJXB33rNir"
        }],
        recentUpdate: {
            updateDate: new Date().getTime(),
            updateAuthorName: "Travis Scott",
            updateAuthorID: "BXizcEzSJXB33rNir"
        }
    });

//inserts fake project data
        Projects.insert({
        title: "Project For Dr. Henry's Awesome Course",
        authorName: "Denny Scott",
        description: "A Web Project created for ACS-3909",
        authorID: 'ifzqdMcRa78c3LWu3',
        submitted: now,
        updates: [{
            updateDate: new Date().getTime(),
            updateAuthorName: "Denny Scott",
            updateAuthorID: "ifzqdMcRa78c3LWu3"
        }],
        recentUpdate: {
            updateDate: new Date().getTime(),
            updateAuthorName: "Denny Scott",
            updateAuthorID: "ifzqdMcRa78c3LWu3"
        }
    });
}