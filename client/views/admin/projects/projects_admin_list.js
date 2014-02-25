onProjectDelete = false;
onProjectRoles = false;
clickedID = null;

Template.projectsAdminList.events({
		"click #newProjBtn" : function () {
			$("#search-field").val("");
			updateView($("#search-field").val());
		if(user.profile.userGroup == "Admin" || user.profile.userGroup == "Office Manager"){
			$('#create-side-title').val("");
			$("#incorrect-fill-label").text("");
			$('#incorrect-pass-label').text("");
			$('#project-password-two').val("");
			$('#project-password').val("");
		}
	},

	'click #defBtn': function (){
		$("#addDefFolder").modal('show');
	},

	'keyup #search-field' : function () {
		updateView($("#search-field").val());
		
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
		$("#update-title").text(this.title);
		$("#update-submitted").text(this.recentUpdate.updateAuthorName);

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
	}
});

Template.projectsAdminList.helpers({
	/**
	 * Finad all projects and give them an integer rank for animation
	 * @return Collection Returns all projects sorted by update time with an integer ranking
	 */
	projectsWithRank: function() {
    	return Projects.find({}, {sort : {"title" : 1}});
		
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
};

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

function deleteProject(passedID){
	workingProjects.remove({_id: passedID});
    Projects.remove({_id: passedID});
}

