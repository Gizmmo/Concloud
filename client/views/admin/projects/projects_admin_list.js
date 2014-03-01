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

	'click #selectAll': function () {
		myArray = $('.tableBox');
		if ($('#selectAll').is(':checked')){
			for(var i = 0; i < myArray.length; i++){
				$(myArray[i]).prop('checked', true);
			}
		} else {
			for(var i = 0; i < myArray.length; i++){
				$(myArray[i]).prop('checked', false);
			}
		}
	},

	'click #removeSelected': function () {
		myArray = $('.tableBox');
		if(Session.get("NewRow")){
			if($("#newRow").length>0){
				$($('#tableData').find("tbody").find("tr")[0]).remove();
			}
			Session.set("NewRow", false);
		} else {
			if(myArray){
				for(var i = 0; i < myArray.length; i++){
					if($(myArray[i]).is(':checked')){
						var split = $(myArray[i]).context.id.split("-");
						var projectID = split[1];
						Meteor.call('removeProject', projectID, function (error, result) {});
					}
				}
			}
		}
		 
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

		var project = Projects.findOne({_id: split[1]});
		for (var i = 0; i < dataRows.length; i++) {
			if(i>0){
				var dataRow = $(dataRows[i]);
				if(dataRow.hasClass('String')){
					dataRow.html("<input type='text' id='txtName' value='"+dataRow.html()+"'/>");
				} else if(dataRow.hasClass('Password')){
					dataRow.html("<input type='password' id='txtName' value='"+project.password+"'/>");
				} else if(dataRow.hasClass("Boolean")){
					if(dataRow.find("i").hasClass("fa-check")){
						dataRow.html("<input type='checkbox' id='checkbox' checked = 'true' />");
					}else{
						dataRow.html("<input type='checkbox' id='checkbox' checked = 'false' />");
					}
				}
			}
		}
	},

	'click .confirmProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");
		var button = $("#editbutton-" + split[1]);
		var confirmbutton = $("#confirmbutton-" + split[1]);
		var project = Projects.findOne({_id: split[1]});

		confirmbutton.attr("disabled",true);
		button.attr("disabled", false);

		var row = $('#row-' + split[1]);
		var dataRows = row.find("td");

		for (var i = 0; i < dataRows.length; i++) {
			if(i>0){
				var dataRow = $(dataRows[i]);
				if(dataRow.hasClass('String')){
					dataRow.html(dataRow.find("input").val());
				}else if(dataRow.hasClass('Password')){
					var data = dataRow.find("input").val();
					var returnString = "";
					for(var t = 0; t < data.length; t++){
						returnString += '*';
					}
					dataRow.html(returnString);
				}else if(dataRow.hasClass("Boolean")){
					if(dataRow.find("input").is(":checked")){
						dataRow.html("<i class=\"fa fa-check\"></i>");
					}else{
						dataRow.html("<i class=\"fa fa-ban\"></i>");
					}
				}
			}
		}

		//UPDATES PROJECT!!
		project.title = $(dataRows[1]).html();
		project.password = $(dataRows[2]).html();
		console.log(project);

		Meteor.call('updateProjectVitals', project, function (error, result) {});
	},

	'click #addRow' : function(){
		if(!Session.get("NewRow")){
			Session.set("NewRow", true);
			$('#tableData').find("tbody").prepend(Template['emptyProject']());
			var newRow = $($('#tableData').find("tbody").find('tr')[0]);
			var dataRows = newRow.find("td");

			for (var i = 0; i < dataRows.length; i++) {
				if(i>0){
					var dataRow = $(dataRows[i]);
					if(dataRow.hasClass('String')){
						dataRow.html("<input type='text' id='txtName' value=''/>");
					}else if (dataRow.hasClass('Password')){
						dataRow.html("<input type='password' id='txtName' value=''/>");
					}else if(dataRow.hasClass("Boolean")){
						dataRow.html("<input type='checkbox' id='checkbox' checked = 'true' />");
					} else {
						if(dataRows.length -1 !== i){
							dataRow.html("");
						}
					}
				}
			}

			var editProject = $(dataRows[dataRows.length-1]).find("button.editProject");
			var completeProject = $(dataRows[dataRows.length-1]).find("button.confirmProject");
			var deleteProject = $(dataRows[dataRows.length-1]).find("button.deleteProject");
			var manageProject = $(dataRows[dataRows.length-1]).find("button.manageProject");
			$(dataRows[dataRows.length-1]).find("a.goToProject").remove();

			editProject.attr("disabled",true);
			completeProject.attr("disabled", false);
			manageProject.attr("disabled", true);

			completeProject.removeClass("confirmProject");
			completeProject.attr('id', "CompleteRow");
			deleteProject.removeClass("deleteProject");
			deleteProject.attr("id", "deleteRow");

			$("#tableData").prepend(newRow);
			$(newRow.find('td')[1]).find('input').focus();
		}else{
			alert("Already have a new Row, complete it before continuing.");
		}

	},

	'click #CompleteRow' : function() {
		var completedRow = $($('#tableData').find("tbody").find("tr")[0]);
		//INSERT DATA HERE
		var projectID = 12345;

		var dataRows = completedRow.find("td");

		var foldersData = Folders.find({}, {sort: {"name": 1}}).fetch();
		var folderUpdate = createFolderUpdate();
		var folderCreation = createFolderCreation();
		var project = {
			title: $(dataRows[1]).find('input').val(),
			password: $(dataRows[2]).find('input').val(),
			folders:{}
		};
		console.log(project);

		foldersData.forEach(function (folder) {
			project.folders[folder.name] = createFolder(folder.name, folderCreation, folderUpdate);
		});
		$(completedRow).remove();

		// the newly created Project's path after creating
		Meteor.call('project', project, function (error, id) {
			if (error) {
				console.log(error);
			}

			Session.set("addingProject", false);
		});

		Session.set("NewRow", false);

	},

	'click #deleteRow' : function() {
		var newRow = $($('#tableData').find("tbody").find("tr")[0]).remove();
		Session.set("NewRow", false);
	},

	'click .manageProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");

		var projectID = split[1];
		Router.go('projectAdminPage', {"_id": split[1]});
		

	},

	'click .deleteProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");
		targetParent = $(event.target)[0].parentNode;
		while(!$(targetParent).hasClass('btn-group')){
			targetParent = targetParent.parentNode;
		}
		if($(targetParent).find('.confirmDelete').length ==0){
			$(targetParent).append(Template['confirmDeleteButton']({_id: this._id}));
			var foundButton = $(targetParent).find('.confirmDelete');
			var height = $("#confirmbutton-"+split[1]).css('height');
			$(foundButton).toggle('show');
		} else {
			var foundButton = $(targetParent).find('.confirmDelete');
			$(foundButton).toggle('show', function() {
				$(foundButton).remove();
			});
			
		}

	},

	'click .confirmDelete' : function () {
		var split = event.target.id.split("-");
		var projectID = split[1];
		Meteor.call('removeProject', projectID, function (error, result) {});
	}
});

Template.projectsAdminList.helpers({
	/**
	 * Finad all projects and give them an integer rank for animation
	 * @return Collection Returns all projects sorted by update time with an integer ranking
	 */
	projects: function() {
    	return Projects.find({}, {sort : {"title" : 1}});
		
	}
});

function updateView(searchValue){
		if(searchValue == undefined || searchValue == null || searchValue == ""){
		projects = Projects.find({});
		projects.forEach(function (project) {
			$('#' + "row-" + project._id).show();
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
				$('#' + "row-" + project._id).show();			
			}

			if(!found){
				$('#' + "row-" + project._id).hide();			
			}

		});
	}
}
