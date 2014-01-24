constructProject = function(){

    //Query the database for this project
    var folderData = Projects.findOne({_id: Session.get("currentProject")});
    //Get the stack of folders that we are currently in
    var projectStack = getFolderStack();
    var title = $('#projectBreadcrumbs');
    var baseData = $('#header-base').clone(); 
    title.empty();
    title.html(baseData);
    //Iterate trough the stack until we are in at the depth we currently are
    for(var i = 0; i < projectStack.length; i++) {
	folderData = folderData.folders[projectStack[i]];
	constructBreadcrumbs(title,folderData);
	console.log(folderData);
    }
    //Make an array out of all folders of the selected folder
    var arrayFolders = arrayify(folderData.folders);
    //Make an array out of all the file of the selected files.
    var arrayFiles = arrayify(folderData.files);
  //Empty the DOM
	$('#projectFolders').empty();
	for(var i = 0; i < arrayFolders.length; i++) {
	  var currentFolder = arrayFolders[i].proData;
	    $('#projectFolders').append(
		"<li class=\"browse-file\" dropzone=\"copy move\"><div class=\"filename-col col-xs-6\"><input type=\"checkbox\" class=\"projectCheckbox\"> <img class=\"sprite sprite_web s_web_folder_user_32 icon\" alt=\"marks\" draggable=\"true\" src=\"/img/icon_spacer.gif\"> <a class=\"filename-link\" draggable=\"true\" hidefocus=\"hideFocus\" id=\"" + currentFolder.vartype + "\" onclick =\"enterFolder(this)\" target=\"_self\">" + currentFolder.folderName + "</a></div><div class=\"kind col-xs-3\"><span class=\"category\">folder</span><span class=\"extension secondary\"></span></div><div class=\"modified col-xs-3\"><span class=\"modified-time\">" + currentFolder.folderUpdate.updateDate + "</span></div><br class=\"clear\"></li>"
	    );
	}

	var projectFiles = $('#projectFiles');
	projectFiles.empty();
	
	for(var i = 0; i < arrayFiles.length; i++) {
	    var currentFile = arrayFiles[i].proData;
	    projectFiles.append(
		"<li class=\"browse-file\" data-identity=\"121387510_46753\" id=\"f_121387510_46753\" dropzone=\"copy move\"><div class=\"filename-col col-xs-6\"><input type=\"checkbox\" class=\"projectCheckbox\"><img class=\"sprite sprite_web s_web_page_white_text_32 icon\" alt=\"YAML Call.txt\" draggable=\"true\" src=\"/img/icon_spacer.gif\"><a href=\"/home/marks\" class=\"filename-link\" draggable=\"true\" hidefocus=\"hideFocus\" target=\"_self\">" + currentFile.fileName + "</a></div><div class=\"kind col-xs-3\"><span class=\"category\">document</span><span class=\"extension secondary\">" + currentFile.fileType + "</span></div><div class=\"modified col-xs-3\"><span class=\"modified-time\">" + currentFile.fileUpdate.updateDate + "</span></div><br class=\"clear\"></li>"
	    );
	}

    return folderData;
};

enterFolder = function (element) {
    	var folderClicked = $(element).attr('id'); 
	addToFolderStack(folderClicked);
	
	//construct the project from the found folderData
	var folderData = constructProject();
	

};

function constructBreadcrumbs (title, folderData) {
    //Adjust the breadcrumbs
    title.html(title.html() + "/" +  "<span class='headerLink' id='header-" + folderData.vartype + "'>" + folderData.folderName + "</span>");    
};

