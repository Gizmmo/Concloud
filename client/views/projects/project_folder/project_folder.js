Template.project_folder.events({
    'click .filename-link' : function(event){
	var folderClicked = $(event.target).attr('id'); 
	addToFolderStack(folderClicked);
	
	var folderData = Projects.findOne({_id: Session.get("currentProject")});
	var projectStack = getFolderStack();
	for(var i = 0; i < projectStack.length; i++) {
	    folderData = folderData.folders[projectStack[i]];
	}
	
	//Empty the DOM
	$('#projectFolders').empty();
	$('#projectFolders').append("hello");
	
    }
});