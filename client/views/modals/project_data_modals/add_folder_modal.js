Template.addFolderModal.events({
	'click #addFolder' : function (event) {
		if($(event.target).attr('id')!=="submitNewFolder"){
			clearBackground(event, "addFolder");
		}
	},

	'keypress' : function(event) {
		if(event.which === 13){
			submitFolder(event);
		}
	},

'click #submitNewFolder' : function(event){
	submitFolder(event);
	}
});

function submitFolder(event) {
		var folderTitle = $('#addFolderName').val();
	if(folderTitle != 'undefined'){
		var projectData = Projects.findOne({_id: Session.get("currentProject")});
		var folderData = getFolderData(projectData);
		if(!(folderTitle in folderData.folders)){
			folderData.folders[folderTitle] = createFolder(folderTitle, folderTitle);
			Meteor.call('createDirectory', getDirectoryFromStack(projectData, false) + folderTitle, function (error, result) {
				if(error){
					console.log(error);
				} else {
					clearBackground(event, "addFolder");
				}
			});
			Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);
		}else{
			throwError("This folder already existed, please create a new folder name.");
		}
	}
}
