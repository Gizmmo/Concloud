Template.projectsList.helpers({
	/**
	 * Finad all projects and give them an integer rank for animation
	 * @return Collection Returns all projects sorted by update time with an integer ranking
	 */
	projectsWithRank: function () {
		return Projects.find({}, {sort : {"title" : 1}});	
	}
});

Template.projectsList.events({
	'keyup #search-field' : function () {
		updateView($("#search-field").val());
	}
});

function updateView(searchValue) {
	if(searchValue == undefined || searchValue == null || searchValue == ""){
		projects = Projects.find({});
		projects.forEach(function (project) {
			$('#' + project._id).show();
		});
	}else {
		projects = Projects.find({});
		projects.forEach(function (project) {
			searchStrings = searchValue.trim().split(" ");
			var numInc = project.rank;
			var found = true;
			for (var i = 0; i < searchStrings.length; i++) {
				if(project.title.toLowerCase().indexOf(searchStrings[i].toLowerCase() ) === -1){
					found = false;
				}
			}

			if(found){
				$('#' + project._id).show();
			}

			if(!found){
				$('#' + project._id).hide();
			}

		});
	}
}
