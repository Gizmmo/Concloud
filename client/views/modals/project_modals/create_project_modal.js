Template.createProjectModal.events({
	'click #createSideProj' : function (event) {
		if($(event.target).attr('id')!=="create-side-project"){
			clearBackground(event, "createSideProj");
		}
	},
	'keypress' : function(event) {
		if(event.which === 13){
			if(acceptPasswords()){
				createSideProject(event);
			}
		}
	},

	'click #create-side-project' : function (event) {
		event.preventDefault();
		if(acceptPasswords()){
			createSideProject(event);
		}
	}
});

Template.createProjectModal.helpers({
	addingProject: function () {
		return Session.get("addingProject");
	}
});

function createSideProject(event){
	//This will stop the default submitting of the form
	var userName = Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName;
	var foldersData = Folders.find({}, {sort: {"name": 1}}).fetch();
	
	Meteor.call('createNewProjectDirectories', $('#create-side-title').val(), foldersData, function (error, result) {
		if(error){
			console.log(error);
			Session.set("addingProject", false);
				clearBackground(event, "createSideProj");
				$("#createSideProj").modal("hide");
		}
		else{
			var folderUpdate = createFolderUpdate();
			var folderCreation = createFolderCreation();
			var project = {title:$('#create-side-title').val(),
			password: $("#project-password").val(),
			folders:{}};


			foldersData.forEach(function (folder) {
				project.folders[folder.name] = createFolder(folder.name, folderCreation, folderUpdate);
			});


			// the newly created Project's path after creating
			Meteor.call('project', project, function (error, id) {
				if (error) {
					console.log(error);
				}

				Session.set("addingProject", false);
				clearBackground(event, "createSideProj");
				$("#createSideProj").modal("hide");
			});

			}
	});

	

}

function acceptPasswords(){
	if($("#project-password").val() === $("#project-password-two").val()){
		return true;
	}
	$("#incorrect-pass-label").text("Please enter matching passwords");
	return false;
}