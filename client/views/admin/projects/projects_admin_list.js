onProjectDelete = false;
onProjectRoles = false;
searchProjFieldLength = 0;
masterProjects = new Meteor.Collection(null);
workingProjects = new Meteor.Collection(null);

Template.projectsAdminList.events({
		"click #newProjBtn" : function () {
		if(user.profile.userGroup == "Admin" || user.profile.userGroup == "Office Manager"){
			$("#createSideProj").modal("toggle");
			$('#create-side-title').val("");
			$('#create-side-description').val("");
			$("#incorrect-fill-label").text("");
		}
	},

	'keyup' : function () {
		var searchProjString = $("#search-proj-admin-field").val();
		
		if(searchProjString.length != searchProjFieldLength){
			updateProjRemove(searchProjString);
		} 
		searchProjFieldLength = searchProjString.length;
		
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

