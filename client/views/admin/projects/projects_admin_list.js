onProjectDelete = false;
onProjectRoles = false;
searchProjFieldLength = 0;
var masterProjects = new Meteor.Collection(null);
var workingProjects = new Meteor.Collection(null);

Template.projectsAdminList.events({
	'keyup' : function () {
		var searchProjString = $("#search-proj-admin-field").val();
		
		if(searchProjString.length > searchProjFieldLength){
			updateProjRemove(searchProjString);
		} else if (searchProjString.length < searchProjFieldLength){
			updateProjAdd(searchProjString);
		}
		searchProjFieldLength = searchProjString.length;
		
	},

	'click #create-project' : function () {
				//This will stop the default submitting of the form
		var userName = Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName;
	    
	        var folderUpdate = createFolderUpdate();
	        var folderCreation = createFolderCreation();
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

	       
		var title = $("#create-title").val();
		var description = $("#create-description").val();

		//Creates a project var that will pass the arg
		//to the database
		var project = {
			title: title,
			description: description,
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
                }
            } else {
            	masterProjects.insert(project);
            	workingProjects.insert(project);
            }
        });

	},

	'click #delbtn' : function () {
		onProjectDelete = !onProjectDelete;
		onProjectRoles = false;
		if(onProjectDelete){
			$( ".b-project-item" ).removeClass( "badger-info badger-warning" ).addClass( "badger-danger" );
			var boxes = $( ".b-project-item" );
			//var xImage = $();
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "#deleteData");
				$(boxes[i]).append('<i class="fa fa-times fa-2x close-x" id="close-x"></i>');
			}
			//data-target="#updateData
		} else{
			$( ".b-project-item" ).removeClass( "badger-danger" ).addClass( "badger-info" );
			var boxes = $( ".b-project-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "#updateData");
				$('i').remove('#close-x');
			}
		}
	},

	'click .b-project-item': function () {
		$("#delete-title").text(this.title)
		$("#update-title").text(this.title);
		$("#delete-description").text(this.description);
		$("#update-description").text(this.description);
		$("#delete-submitted").text(this.authorName);
		$("#update-submitted").text(this.authorName);

		clickedID = this._id;
	},

	'click #userRoleBtn' : function () {
		onProjectRoles = !onProjectRoles;
		onProjectDelete = false;
		if(onProjectRoles){
			$( ".b-project-item" ).removeClass( "badger-info badger-left badger-danger" ).addClass( "badger-warning badger-right" );
			var boxes = $( ".b-project-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "");
			}
			//data-target="#updateData
		} else{
			$( ".b-project-item" ).removeClass( "badger-warning badger-right" ).addClass( "badger-info badger-left" );
			var boxes = $( ".b-project-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "#updateData");
			}
		}
	},

	'click #delete-project' : function () {
		workingProjects.remove({_id: clickedID});
		Projects.remove({_id: clickedID});

	},

	'click #update-project': function () {
		var title =$("#update-title").val();
		var description = $("#update-description").val();
		Projects.update({_id: clickedID}, {$set:{"title": title, "description": description}});
		masterProjects.update({_id: clickedID}, {$set:{"title": title, "description": description}});
		workingProjects.update({_id: clickedID}, {$set:{"title": title, "description": description}});
	},
});

Template.projectsAdminList.helpers({
	/**
	 * Finad all projects and give them an integer rank for animation
	 * @return Collection Returns all projects sorted by update time with an integer ranking
	 */
	projectsWithRank: function() {
		masterProjects = new Meteor.Collection(null);
		var projects = Projects.find({});
	
		projects.forEach(function (project){
			masterProjects.insert(project);
		});

		return workingProjects.find({}, {sort : {"title" : 1}});
	}
});

Template.projectsAdminList.created = function () {
	onProjectDelete = false;
	onProjectRoles = false;


	masterProjects = new Meteor.Collection(null);
	workingProjects = new Meteor.Collection(null);

	searchProjFieldLength = 0;
	projects = Projects.find({});
	
	projects.forEach(function (project){
		workingProjects.insert(project);
		masterProjects.insert(project);
	});
};

function updateProjRemove(searchString){
	masterProjects.find({}).forEach(function (project) {
		if(searchString.length > 0){
			searchStrings = searchString.split(" ");
			var found = false;
			for (var i = 0; i < searchStrings.length; i++) {
				if(project.title.indexOf(searchStrings[i] ) != -1 || project.description.indexOf(searchStrings[i] ) != -1)
				found = true;
			}

			if(!found){
				workingProjects.remove(project._id)
			}else {
			}
		}
	});
}

function updateProjAdd(searchString){
	masterProjects.find({}).forEach(function (project){
		if(!(workingProjects.findOne({"_id" : project._id}))){
			if(project.title.indexOf(searchString) != -1 || project.description.indexOf(searchString) != -1){
				workingProjects.insert(project);
			}
		}
	});
}
