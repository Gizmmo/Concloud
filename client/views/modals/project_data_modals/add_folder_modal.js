Template.addFolderModal.events({
	'click #addFolder' : function (event) {
		clearBackground(event, "addFolder");
	},

	'keypress' : function() {
		if(event.which === 13){
			clearBackground();
			submitFolder();
		}
	},

'click #submitNewFolder' : function(){
	submitFolder();
	}
});

function submitFolder() {
		var folderTitle = $('#addFolderName').val();
	if(folderTitle != 'undefined'){
		var projectData = Projects.findOne({_id: Session.get("currentProject")});
		var folderData = getFolderData(projectData);
		if(!(folderTitle in folderData.folders)){
			folderData.folders[folderTitle] = createFolder(folderTitle, folderTitle);
			Meteor.call('createDirectory', getDirectoryFromStack(projectData, false) + folderTitle, function (error, result) {
				if(error)
					console.log(error);
			});
			Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);
		}else{
			throwError("This folder already existed, please create a new folder name.");
		}
	}
}
