// Fixture data 
if (Projects.find().count() === 0) {
    var now = new Date().getTime();
    var time = new Date().getTime();


    // create two users
    var tomId = Meteor.users.insert({
        profile: {
            firstName: 'Tom',
            lastName: 'Coleman',
            userGroup : "Employee",
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
    });
    var tom = Meteor.users.findOne(tomId);
    var sachaId = Meteor.users.insert({
        profile: {
            firstName: 'Sacha',
            lastName: 'Greif',
            userGroup : "Employee",
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
    });


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