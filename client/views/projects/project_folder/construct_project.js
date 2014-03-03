constructProject = function(){
    //Query the database for this project
    var project = Projects.findOne({_id: Session.get("currentProject")});
    var folderId = Session.get("folderId");
    //Get the stack of folders that we are currently in
    var folderData = Folders.find({parentId: projectStack[0]});
    var fileData = Files.find({parentId: projectStack[0]});
    var folder = Folders.findOne({_id: projectStack[0]});
    var title = $('#projectBreadcrumbs');
    var baseData = $('#header-base').clone();
    title.empty();
    title.html(baseData);
    //Iterate trough the stack until we are in at the depth we currently are
   //  for(var i = 0; i < projectStack.length; i++) {
   //   constructBreadcrumbs(title,folderData);
   // }

  //Empty the DOM
  $('#projectFolders').empty();
  for(i = 0; i < folderData.length; i++) {
    var currentFolder = folderData[i];
   $('#projectFolders').append(Template['project_folder'](folderData[i]));
 }

 var projectFiles = $('#projectFiles');
 projectFiles.empty();

 for(i = 0; i < fileData.length; i++) {
   var currentFile = fileData[i];
   // var cssClass = checkImageType(currentFile.fileType);
   projectFiles.append(Template['project_files'](fileData[i]));
 }

 return folderData;
};

enterFolder = function (element) {
 var folderClicked = $(element).attr('id');
 Session.set('folderId', folderClicked);

	//construct the project from the found folderData
	var folderData = constructProject();
};

function constructBreadcrumbs (title, folderData) {
    //Adjust the breadcrumbs
    title.html(title.html() + "/" +  "<span class='headerLink' id='header-" + folderData._id + "'>" + folderData.folderName + "</span>");
  }
