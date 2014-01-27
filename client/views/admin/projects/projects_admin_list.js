onProjectDelete = false;
onProjectRoles = false;
searchProjFieldLength = 0;
masterProjects = new Meteor.Collection(null);
workingProjects = new Meteor.Collection(null);

Template.projectsAdminList.events({
	'keyup' : function () {
		var searchProjString = $("#search-proj-admin-field").val();
		
		if(searchProjString.length != searchProjFieldLength){
			updateProjRemove(searchProjString);
		} 
		searchProjFieldLength = searchProjString.length;
		
	},


	'click #create-project' : function () {
				//This will stop the default submitting of the form
		var userName = Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName;
	    
	    	Meteor.call('createNewProjectDirectories', $('#create-title').val(), function (error, result) {
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
			title: $('#create-title').val(),
			description: $('#create-description').val(),
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
				$(boxes[i]).attr("data-target", "");
				$(boxes[i]).append('<i class="fa fa-times fa-2x close-x" id="close-x" title="Delete Project" rel="tooltip"></i>');
				$('i').remove('.rightBtn');
				$("[rel=tooltip").tooltip();
			}
			//data-target="#updateData
		} else{
			$( ".b-project-item" ).removeClass( "badger-danger" ).addClass( "badger-info" );
			var boxes = $( ".b-project-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "#updateData");
				$('i').remove('#close-x');
				$(boxes[i]).append('<i class="fa fa-arrow-circle-o-right rightBtn fa-2x" title="Go To Project" rel="tooltip"></i>');
				$("[rel=tooltip").tooltip();
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
			$( ".b-project-item" ).removeClass( "badger-info badger-left badger-danger" ).addClass( "badger-warning badger-left" );
			var boxes = $( ".b-project-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "");
				$('i').remove('.rightBtn');
				$('i').remove('#close-x');
				$("[rel=tooltip").tooltip();
			}
			//data-target="#updateData
		} else{
			$( ".b-project-item" ).removeClass( "badger-warning badger-right" ).addClass( "badger-info badger-left" );
			var boxes = $( ".b-project-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "#updateData");
			    $(boxes[i]).append('<i class="link fa fa-arrow-circle-o-right rightBtn fa-2x" title="Go To Project" rel="tooltip"></i>');
			    $('i').remove('#close-x');
			    $("[rel=tooltip").tooltip();

			}
		}
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
			project.rank = 0;
			masterProjects.insert(project);
		});

		return workingProjects.find({}, {sort : {"rank" : -1, "title" : 1}});
	}
});

Template.projectsAdminList.rendered = function () {
	    if(onProjectDelete){
	    	$( ".b-project-item" ).removeClass( "badger-info badger-warning" ).addClass( "badger-danger" );
			var boxes = $( ".b-project-item" );
       		for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "");
				$(boxes[i]).append('<i class="fa fa-times fa-2x close-x" id="close-x" title="Go To Project" rel="tooltip"></i>');
				$('i').remove('.rightBtn');
			}
    } else if (onProjectRoles){
       		$( ".b-project-item" ).removeClass( "badger-info badger-left badger-danger" ).addClass( "badger-warning badger-left" );
			var boxes = $( ".b-project-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "");
			}
    }else{
	}
};

Template.projectsAdminList.created = function () {
	onProjectDelete = false;
	onProjectRoles = false;


	masterProjects = new Meteor.Collection(null);
	workingProjects = new Meteor.Collection(null);

	searchProjFieldLength = 0;
	projects = Projects.find({});
	
	projects.forEach(function (project){
		project.rank = 0;
		workingProjects.insert(project);
		masterProjects.insert(project);
	});
};

function updateProjRemove(searchString){
searchString = searchString.toLowerCase();
	masterProjects.find({}).forEach(function (project) {
		masterProjects.update({"_id": project._id}, {$set: {"rank" : 0}});
		if(searchString.length > 0){
			searchStrings = searchString.trim().split(" ");
			var numInc = project.rank;
			var found = false;
			for (var i = 0; i < searchStrings.length; i++) {
				if(!(workingProjects.findOne({"_id" : project._id}))){
					if(project.title.toLowerCase().indexOf(searchStrings[i]) != -1 || project.description.toLowerCase().indexOf(searchStrings[i]) != -1){
						workingProjects.insert(project);
					}
				}
				if(project.title.toLowerCase().indexOf(searchStrings[i] ) != -1){
					found = true;
					numInc+=5;
					workingProjects.update({"_id": project._id}, {$set: {"rank" : numInc}});
				}
				if(project.description.toLowerCase().indexOf(searchStrings[i] ) != -1){
					found = true;
					numInc++;
					workingProjects.update({"_id": project._id}, {$set: {"rank" : numInc}});
				}
			}

			if(!found){
				workingProjects.remove(project._id)
			}else {
			}
		} else {
			masterProjects.find({}).forEach(function (project) {
				if(!(workingProjects.findOne({"_id" : project._id}))){
					workingProjects.insert(project);
				}
			});
		}
	});
}

function deleteProject(passedID){
	workingProjects.remove({_id: passedID});
    Projects.remove({_id: passedID});
}

