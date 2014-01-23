searchProjFieldLength = 0;
var masterProjects = new Meteor.Collection(null);
var workingProjects = new Meteor.Collection(null);


Template.projectsList.helpers({
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

Template.projectsList.events({
	'keyup' : function () {
		var searchProjString = $("#search-proj-admin-field").val();
		
		if(searchProjString.length > searchProjFieldLength){
			updateProjRemove(searchProjString);
		} else if (searchProjString.length < searchProjFieldLength){
			updateProjAdd(searchProjString);
		}
		searchProjFieldLength = searchProjString.length;
		
	}
});

Template.projectsList.created = function () {

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
