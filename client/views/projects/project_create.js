Template.projectCreate.events({
	/**
	 * Creates a projects and inserts it in the project collection
	 * @param  Event event The event of clicking the button
	 * @return void
	 */
	'submit form': function (event) {
		//This will stop the default submitting of the form
		event.preventDefault();

	        var folderCreation = {
		    createdByAuthorID : Meteor.user()._id,
		    createdByAuthorName : Meteor.user().profile.name,
		    createdDate : new Date()
		}; 

	        var folderUpdate = {
		    updateDate : new Date(),
		    updateAuthorID : Meteor.user()._id,
		    updateAuthorName : Meteor.user().profile.name
		};

	        var changeOrders = createFolder("Change Orders", "changeOrders", folderCreation, folderUpdate);
	        var consultant = createFolder("Consultant", "consultant", folderCreation, folderUpdate);
	        var contractsAndPO = createFolder("Contracts and PO's", "contractsAndPO", folderCreation, folderUpdate);
	        var dailyLogs = createFolder("Daily Log's", "dailyLogs", folderCreation, folderUpdate);
	        var drawings = createFolder("Drawings", "drawings", folderCreation, folderUpdate);
	        var estimates = createFolder("Estimates", "estimates", folderCreation, folderUpdate);
	        var insRepTest = createFolder("Inspections, Reports & Tests", "insRepTest", folderCreation, folderUpdate);
	        var legalCivicUtility =  createFolder("Legal, Civic & Utility","legalCivicUtility", folderCreation, folderUpdate);
	        var meetingMinutes = createFolder("Minutes of Meetings","meetingMinutes", folderCreation, folderUpdate);
	        var owner = createFolder("Owner", "owner", folderCreation, folderUpdate);
	        var pcns = createFolder("PCN's", "pcns", folderCreation, folderUpdate);
	        var pictures = createFolder("Pictures", "pictures", folderCreation, folderUpdate);
	        var preliminary = createFolder("Preliminary","preliminary", folderCreation, folderUpdate);
	        var safety = createFolder("Safety", "safety", folderCreation, folderUpdate);
	        var shopDrawings = createFolder("Shop Drawings", "shopDrawings", folderCreation, folderUpdate);
	        var subtrades = createFolder("Subtrades", "subtrades", folderCreation, folderUpdate);

	        var update = createFile("Update", "txt", folderCreation, folderUpdate);
	        var receipt = createFile("Reciept", "txt", folderCreation, folderUpdate);

	        var inChange = createFolder("inChange", "inChange", folderCreation, folderUpdate);
	        var updateChange = createFile("Update", "txt", folderCreation, folderUpdate);
	       
	        changeOrders.files = {
		    updateChange : updateChange
		};

	        changeOrders.folders = {inChange : inChange};

	       

		//Creates a project var that will pass the arg
		//to the database
		var project = {
			title: $(event.target).find('[name=title]').val(),
			description: $(event.target).find('[name=description]').val(),
		        folders: {
			    changeOrders : changeOrders,
			    consultant : consultant,
			    contractsAndPO : contractsAndPO,
			    dailyLogs : dailyLogs,
			    drawings : drawings,
			    estimates : estimates,
			    insRepTest : insRepTest,
			    legalCivicUtility : legalCivicUtility,
			    meetingMinutes : meetingMinutes,
			    owner : owner,
			    pcns : pcns,
			    pictures : pictures,
			    preliminary : preliminary,
			    safety : safety,
			    shopDrawings : shopDrawings,
			    subtrades : subtrades
			},

		        files : {
		  	    update : update,
			    receipt : receipt
		     }
		};

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

function createFolder(name, vartype, folderCreation, folderUpdate){
    return {
	folderCreation : folderCreation,
	folderUpdate : folderUpdate,
	folderName : name,
	vartype : vartype,
	files : {},
	folders : {}
    };
}

function createFile(name, type, fileCreation, fileUpdate){
    return {
	fileCreation : fileCreation,
	fileUpdate : fileUpdate,
	fileName : name,
	fileType : type
    };
}