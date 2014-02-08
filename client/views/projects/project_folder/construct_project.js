constructProject = function(){


    //Query the database for this project
    var folderData = Projects.findOne({_id: Session.get("currentProject")});
    //Get the stack of folders that we are currently in
    var projectStack = getFolderStack();
    var title = $('#projectBreadcrumbs');
    var baseData = $('#header-base').clone();
    title.empty();
    title.html(baseData);
    console.log("Project Stack for breadcrumbs" + projectStack);
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
  for(i = 0; i < arrayFolders.length; i++) {
     var currentFolder = arrayFolders[i].proData;
     $('#projectFolders').append(
      "<li class=\"browse-file\" dropzone=\"copy move\"><div class=\"filename-col col-xs-6\"><input type=\"checkbox\" class=\"projectCheckbox\" id=\"folder-" + currentFolder.folderName + "\"> <img class=\"sprite sprite_web s_web_folder_user_32 icon\" alt=\"marks\" draggable=\"true\" src=\"/img/icon_spacer.gif\"> <a class=\"filename-link\" draggable=\"true\" hidefocus=\"hideFocus\" id=\"" + currentFolder.folderName + "\" onclick =\"enterFolder(this)\" target=\"_self\">" + currentFolder.folderName + "</a></div><div class=\"kind col-xs-2\"><span class=\"category\">folder</span><span class=\"extension secondary\"></span></div><div class=\"modified col-xs-4\"><span class=\"modified-time\">" + formatDate(currentFolder.folderUpdate.updateDate) + "</span></div><br class=\"clear\"></li>"
      );
 }

 var projectFiles = $('#projectFiles');
 projectFiles.empty();

 for(i = 0; i < arrayFiles.length; i++) {
   var currentFile = arrayFiles[i].proData;
   var cssClass = checkImageType(currentFile.fileType);
   projectFiles.append(
      "<li class=\"browse-file\" data-identity=\"121387510_46753\" id=\"f_121387510_46753\" dropzone=\"copy move\"><div class=\"filename-col col-xs-6\"><input type=\"checkbox\" class=\"projectCheckbox\" id=\"file-" + currentFile.fileName + "\"><img class=\"sprite sprite_web " + cssClass + " icon\" alt=\"YAML Call.txt\" draggable=\"true\" src=\"/img/icon_spacer.gif\"><a class=\"filename-link download-file-link\" draggable=\"true\" hidefocus=\"hideFocus\" target=\"_self\">" + currentFile.fileName + "</a></div><div class=\"kind col-xs-2\"><span class=\"category\">document</span><span class=\"extension secondary\">" + currentFile.fileType + "</span></div><div class=\"modified col-xs-4\"><span class=\"modified-time\">" + formatDate(currentFile.fileUpdate.updateDate) + "</span></div><br class=\"clear\"></li>"
      );
}

return folderData;
};

enterFolder = function (element) {
   var folderClicked = $(element).attr('id');
   addToFolderStack(folderClicked);
   Session.set('folderStack', getFolderStack());

	//construct the project from the found folderData
	var folderData = constructProject();
	
};

function constructBreadcrumbs (title, folderData) {
    //Adjust the breadcrumbs
    title.html(title.html() + "/" +  "<span class='headerLink' id='header-" + folderData.folderName + "'>" + folderData.folderName + "</span>");    
}

getFolderData = function(folderData){
    if(typeof folderData === 'undefined'){
     //Query the database for this project
     folderData = Projects.findOne({_id: Session.get("currentProject")});
 }
    //Get the stack of folders that we are currently in
    var projectStack = getFolderStack();
    //Iterate trough the stack until we are in at the depth we currently are
    for(var i = 0; i < projectStack.length; i++) {
       folderData = folderData.folders[projectStack[i]];
   }
   return folderData;
};


createFolder = function(name, folderCreation, folderUpdate){
    console.log(folderCreation);
    if(typeof folderCreation === 'undefined'){
       folderCreation = createFolderCreation();
   }
   if(typeof folderUpdate === 'undefined'){
       folderUpdate = createFolderUpdate();
   }


   return {
       folderCreation : folderCreation,
       folderUpdate : folderUpdate,
       folderName : name,
       files : {},
       folders : {}
   };
};

createFile = function(name, type, fileCreation, fileUpdate){
   if(typeof fileCreation === 'undefined'){
    fileCreation = createFolderCreation();
}
if(typeof fileUpdate === 'undefined'){
    fileUpdate = createFolderUpdate();
}
return {
   fileCreation : fileCreation,
   fileUpdate : fileUpdate,
   fileName : name,
   fileType : type
};
};

createFolderCreation = function(){
    var folderCreation = {
    	createdByAuthorID : Meteor.user()._id,
    	createdByAuthorName : Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName,
    	createdDate : new Date()
    };
    return folderCreation;
};

createFolderUpdate = function(){
    var folderUpdate = {
    	updateDate : new Date(),
    	updateAuthorID : Meteor.user()._id,
    	updateAuthorName : Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName
    };
    return folderUpdate;
};
