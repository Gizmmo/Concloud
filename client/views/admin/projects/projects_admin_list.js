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
			$("#createSideProj").modal('show');
		}
	},

	'keyup #search-field' : function () {
		updateView($("#search-field").val());
		
	},

	'click .editProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");
		var button = $("#editbutton-" + split[1]);
		var confirmbutton = $("#confirmbutton-" + split[1]);

		button.attr("disabled",true);
		confirmbutton.attr("disabled", false);

		var row = $('#row-' + split[1]);
		var dataRows = row.find("td");

		for (var i = 0; i < dataRows.length; i++) {
			if(i>0){
				var dataRow = $(dataRows[i]);
				if(dataRow.hasClass('String')){
					dataRow.html("<input type='text' id='txtName' value='"+dataRow.html()+"'/>");
				}else if(dataRow.hasClass("Boolean")){
					if(dataRow.find("i").hasClass("fa-check")){
						dataRow.html("<input type='checkbox' id='checkbox' checked = 'true' />");
					}else{
						dataRow.html("<input type='checkbox' id='checkbox' checked = 'false' />");
					}
				}
			}
		};
	},

	'click .confirmProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");
		var button = $("#editbutton-" + split[1]);
		var confirmbutton = $("#confirmbutton-" + split[1]);

		confirmbutton.attr("disabled",true);
		button.attr("disabled", false);

		var row = $('#row-' + split[1]);
		var dataRows = row.find("td");

		for (var i = 0; i < dataRows.length; i++) {
			if(i>0){
				var dataRow = $(dataRows[i]);
				if(dataRow.hasClass('String')){
					dataRow.html(dataRow.find("input").val());
				}else if(dataRow.hasClass("Boolean")){
					if(dataRow.find("input").is(":checked")){
						dataRow.html("<i class=\"fa fa-check\"></i>");
					}else{
						dataRow.html("<i class=\"fa fa-ban\"></i>");
					}
				}
			}
		};
	},

	'click .manageProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");

		var proejctID = $(split[1]);
		

	},

	'click .deleteProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");
		var row = $('#row-' + split[1]);
		row.remove();

		var proejctID = $(split[1]);
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

