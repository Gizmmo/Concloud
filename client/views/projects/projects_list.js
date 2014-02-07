searchProjFieldLength = 0;
var masterProjects = new Meteor.Collection(null);
var workingProjects = new Meteor.Collection(null);


Template.projectsList.helpers({
	/**
	 * Finad all projects and give them an integer rank for animation
	 * @return Collection Returns all projects sorted by update time with an integer ranking
	 */
	projects: function() {
		masterProjects = new Meteor.Collection(null);
		var projects = Projects.find({});
	
		projects.forEach(function (project){
			project.rank = 0;
			masterProjects.insert(project);
		});

		return workingProjects.find({}, {sort : {"rank" : -1, "title" : 1}});
	},

	projectsWithRank: function () {
		var result;
		if( $("#search-proj-admin-field").val()){
			result = $("#search-proj-admin-field").val();
		} else {
			result = "";
		}
		return Projects.find({$or: [{"title" : new RegExp(result)}, {"description" : new RegExp(result)}]});
	}
});

Template.projectsList.events({
	'keyup' : function () {
		var searchProjString = $("#search-proj-admin-field").val();
		
		if(searchProjString.length != searchProjFieldLength){
			updateProjRemove(searchProjString);
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
