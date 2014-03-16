var originalName = null;
var isEdit;
var editData;
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

	'click .editProject' : function(event, template) {
		if(!isEdit){
			event.preventDefault();
			isEdit = true;
			var split = event.target.id.split("-");
			var button = $("#editbutton-" + split[1]);
			var confirmbutton = $("#confirmbutton-" + split[1]);
			var deleteButton = $("#deletebutton-" + split[1]);

			deleteButton.find('i').attr('class', 'fa fa-ban bigger-120');
			deleteButton.addClass("cancelProject");
			button.attr("disabled",true);
			confirmbutton.attr("disabled", false);

			var row = $('#row-' + split[1]);
			var dataRows = row.find("td");

			var project = Projects.findOne({_id: split[1]});
			for (var i = 0; i < dataRows.length; i++) {
				if(i>0){
					var dataRow = $(dataRows[i]);
					if(dataRow.hasClass('String')){
						if(dataRow.hasClass('Unique')){
							originalName = dataRow.html();
						}
						editData[i] = dataRow.html();
						dataRow.html("<input type='text' id='txtName' value='"+dataRow.html()+"'/>");
					} else if(dataRow.hasClass('Password')){
						dataRow.html("<input type='password' id='txtName' value='"+project.password+"'/>");
					} else if(dataRow.hasClass("Boolean")){
						if(dataRow.find("i").hasClass("fa-check")){
							dataRow.html("<input type='checkbox' id='checkbox' checked = 'true' />");
							editData[i] = true;
						}else{
							dataRow.html("<input type='checkbox' id='checkbox' checked = 'false' />");
							editData[i] = false;
						}
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
		var deleteButton = $("#deletebutton-" + split[1]);

		var row = $('#row-' + split[1]);
		var dataRows = row.find("td");

		if(validateRow(dataRows)){
			confirmbutton.attr("disabled",true);
			button.attr("disabled", false);
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
			project.title = replaceAmp($(dataRows[1]).html());
			project.password = replaceAmp($(dataRows[2]).html());
			isEdit = false;
			deleteButton.removeClass("cancelProject");
			deleteButton.find('i').attr('class', 'fa fa-trash-o bigger-120');
			Meteor.call('updateProjectVitals', project, function (error, result) {});
		}
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
			var completedRow = $($('#tableData').find("tbody").find("tr")[0]);

			var dataRows = completedRow.find("td");

			if(validateRow(dataRows)){
				Session.set("addingProject", true);
				var foldersData = DefaultFolders.find({}, {sort: {"name": 1}}).fetch();

				var project = {
					title: replaceAmp($(dataRows[1]).find('input').val()),
					password: replaceAmp($(dataRows[2]).find('input').val()),
				};

				$(completedRow).remove();

				 Meteor.call('createNewProjectDirectories', project.title, foldersData, function (error, result) {
					

					// the newly created Project's path after creating
					Meteor.call('project', project, function (error, id) {
						if (error) {
							console.log(error);
						}
						foldersData.forEach(function (folder) {
							var adapterFolder = {
								name : folder.name,
								parentId: 'none',
								parentName: 'none',
								projectId: id,
								projectName: project.title,
								permissions: folder.permissions
							};
							Meteor.call("createFolder", adapterFolder, function(){})
						});

						Session.set("addingProject", false);


					});
				});

				

				Session.set("NewRow", false);
			}
		}

	},

	'click #CompleteRow' : function() {
		var completedRow = $($('#tableData').find("tbody").find("tr")[0]);

		var dataRows = completedRow.find("td");

		if(validateRow(dataRows)){
			Session.set("addingProject", true);
			var foldersData = DefaultFolders.find({}, {sort: {"name": 1}}).fetch();

			var project = {
				title: replaceAmp($(dataRows[1]).find('input').val()),
				password: replaceAmp($(dataRows[2]).find('input').val()),
			};

			$(completedRow).remove();

			 Meteor.call('createNewProjectDirectories', project.title, foldersData, function (error, result) {
				

				// the newly created Project's path after creating
				Meteor.call('project', project, function (error, id) {
					if (error) {
						console.log(error);
					}
					foldersData.forEach(function (folder) {
						var adapterFolder = {
							name : folder.name,
							parentId: 'none',
							parentName: 'none',
							projectId: id,
							projectName: project.title,
							permissions: folder.permissions
						};
						Meteor.call("createFolder", adapterFolder, function(){})
					});

					Session.set("addingProject", false);


				});
			});

			

			Session.set("NewRow", false);
		}

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
		var deleteButton = $("#deletebutton-" + split[1]);
		if($(deleteButton).hasClass("cancelProject")){
			deleteButton.find('i').attr('class', 'fa fa-trash-o bigger-120');
			deleteButton.removeClass('cancelProject');
			var button = $("#editbutton-" + split[1]);
			var confirmbutton = $("#confirmbutton-" + split[1]);
			var row = $('#row-' + split[1]);
			var dataRows = row.find("td");

			confirmbutton.attr("disabled",true);
			button.attr("disabled", false);
			for (var i = 0; i < dataRows.length; i++) {
				if(i>0){
					var dataRow = $(dataRows[i]);
					if(dataRow.hasClass('String')){
						dataRow.html(editData[i]);
					}else if(dataRow.hasClass('Password')){
						var data = $(editData[i]).find("input").val();
						var returnString = "";
						for(var t = 0; t < data.length; t++){
							returnString += '*';
						}
						dataRow.html(returnString);
					}else if(dataRow.hasClass("Boolean")){
						if(editData[i]){
							dataRow.html("<i class=\"fa fa-check\"></i>");
						}else{
							dataRow.html("<i class=\"fa fa-ban\"></i>");
						}
					}
				}
			}


			isEdit = false;


		} else {
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
		}

	},

	'click .confirmDelete' : function () {
		var split = event.target.id.split("-");
		var projectID = split[1];
		var project = Projects.findOne({_id: projectID});
		Meteor.call('removeProject', projectID, function (error, result) {});
		Meteor.call("remove", project.title, function(err,result){
			if(err)
				console.log(err);
		});
	}
});

function confirmDelete(){
	$('#removeSelected').popover({
		html: true,
		title: function () {
			return $('#deletehead').html();
		},
		content: function () {
			return $('#deletecontent').html();
		}
	}).on('shown.bs.popover', function(){
		$($('.deleteData')[1]).find('#confirmDelete').on('click', function(){
			removeSelected();
			$('.popover').each(function(){
				$(this).remove();
			});
		});
	}).on('hidden.bs.popover', function(){
		confirmDelete();
	});
}

Template.projectsAdminList.rendered = function () {
	confirmDelete();
};

function removeSelected(){
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
						var project = Projects.findOne({_id: projectID});
						Meteor.call('removeProject', projectID, function (error, result) {});
						Meteor.call("remove", project.title, function(err,result){
							if(err)
								console.log(err);
						});
					}
				}
			}
		}
}

Template.projectsAdminList.helpers({
	/**
	 * Finad all projects and give them an integer rank for animation
	 * @return Collection Returns all projects sorted by update time with an integer ranking
	 */
	 projects: function() {
	 	return Projects.find({}, {sort : {"title" : 1}});

	 },

	 addingProject: function() {
	 	return Session.get("addingProject");
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

function validateRow(dataRows){
	var returnValue = true;
	for (var i = 0; i < dataRows.length; i++) {
		if(i>0){
			var dataRow = $(dataRows[i]);
			dataRow.find('.valCheck').remove();
			if(dataRow.hasClass('String')){
				var dataVal = $(dataRow).find('input').val();
				if($(dataRow).find('input').val().length < 1){
					dataRow.html(dataRow.html() + '<i class="valCheck fa fa-times fa-2x redX" title="Need to fill in a value"></i>');
					returnValue = false;
				} else if (dataRow.hasClass('Unique')){
					originalName = replaceAmp(originalName);
					dataVal = replaceAmp(dataVal);
					if(Projects.findOne({title: dataVal}) && dataVal !== originalName){
						dataRow.html(dataRow.html() + '<i class="valCheck fa fa-times fa-2x redX" title="Please use a Unique Name"></i>');
						returnValue = false;
					}
				} else {
					$(dataRow).append('<i class="valCheck fa fa-check fa-2x greenCheck"></i>');
				}
			}
		}
	}
	return returnValue;
}

function replaceAmp(originalName){
	if(originalName){
		while (originalName.indexOf('&amp') > -1){
			var n = originalName.indexOf('&amp');
			originalName = originalName.substring(0,n) + "&" + originalName.substring((n+5),originalName.length);
		}
	}
	return originalName
}

Template.projectsAdminList.created = function () {
	$("#search-field").val("");
	Session.set("NewRow", false);
	isEdit = false;
	editData = [];
};