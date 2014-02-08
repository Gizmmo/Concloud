Template.createProjectModal.events({
	'click #create-side-project' : function () {
				//This will stop the default submitting of the form
		var userName = Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName;
	    
	    	Meteor.call('createNewProjectDirectories', $('#create-side-title').val(), function (error, result) {
	    		if(error)
	    			console.log(error);
	    	});

	        var folderUpdate = createFolderUpdate();
	        var folderCreation = createFolderCreation();
	        var changeOrders = createFolder("Change Orders",  folderCreation, folderUpdate);
	        var consultant = createFolder("Consultant",  folderCreation, folderUpdate);
	        var contractsAndPO = createFolder("Contracts and PO's",  folderCreation, folderUpdate);
	        var dailyLogs = createFolder("Daily Log's",  folderCreation, folderUpdate);
	        var drawings = createFolder("Drawings",  folderCreation, folderUpdate);
	        var estimates = createFolder("Estimates",  folderCreation, folderUpdate);
	        var insRepTest = createFolder("Inspections, Reports & Tests",  folderCreation, folderUpdate);
	        var legalCivicUtility =  createFolder("Legal, Civic & Utility", folderCreation, folderUpdate);
	        var meetingMinutes = createFolder("Minutes of Meetings", folderCreation, folderUpdate);
	        var owner = createFolder("Owner",  folderCreation, folderUpdate);
	        var pcns = createFolder("PCN's",  folderCreation, folderUpdate);
	        var pictures = createFolder("Pictures", folderCreation, folderUpdate);
	        var preliminary = createFolder("Preliminary", folderCreation, folderUpdate);
	        var safety = createFolder("Safety", folderCreation, folderUpdate);
	        var shopDrawings = createFolder("Shop Drawings", folderCreation, folderUpdate);
	        var subtrades = createFolder("Subtrades", folderCreation, folderUpdate);


	       

		//Creates a project var that will pass the arg
		//to the database
		var project = {
			title: $('#create-side-title').val(),
		        folders: {
			    "Change Orders" : changeOrders,
			    Consultant : consultant,
			    "Contracts and PO's" : contractsAndPO,
			    "Daily Log's" : dailyLogs,
			    Drawings : drawings,
			    Estimates : estimates,
			    "Inspections, Reports & Tests" : insRepTest,
			    "Legal, Civic & Utility" : legalCivicUtility,
			    "Minutes of Meetings" : meetingMinutes,
			    Owner : owner,
			    "PCN's" : pcns,
			    Pictures : pictures,
			    Preliminary : preliminary,
			    Safety : safety,
			    "Shop Drawings" : shopDrawings,
			    Subtrades : subtrades
			}

		};

			//Calls the newly created Project's path after creating
		Meteor.call('project', project, function (error, id) {
			if (error) {
                // display the error to the user
                throwError(error.reason);
                // if the error is that the post already exists, take us there
                if (error.error === 302){
                }
            } else {
            }
        });

	},
});