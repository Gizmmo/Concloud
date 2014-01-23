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

	'click #delbtn' : function () {
		onProjectDelete = !onProjectDelete;
		onProjectRoles = false;
		if(onProjectDelete){
			$( ".b-project-item" ).removeClass( "badger-info badger-warning badger-left" ).addClass( "badger-danger badger-right" );
			var boxes = $( ".b-project-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "#deleteData");
			}
			//data-target="#updateData
		} else{
			$( ".b-project-item" ).removeClass( "badger-danger badger-right" ).addClass( "badger-info badger-left" );
			var boxes = $( ".b-project-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "#updateData");
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
		//Meteor.users.findOne({"_id" : clickedID});
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

