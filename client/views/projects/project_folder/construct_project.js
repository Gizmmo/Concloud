constructProject = function(){
    //Query the database for this project
    var project = Projects.findOne({_id: Session.get("currentProject")});
    var folderId = typeof Session.get("folderId")!=='undefined'?Session.get("folderId"):'none';
    
    //Get the stack of folders that we are currently in
    var folderData = Folders.find({projectId: project._id, parentId: folderId});
    var fileData = Files.find({projectId: project._id, parentId: folderId});
    var title = $('#projectBreadcrumbs');
    var baseData = $('#header-base').clone();
    title.empty();
    title.html(baseData);

   //  Iterate trough the stack until we are in at the depth we currently are
   if(folderId !== 'none'){
    var projectStack = getProjectStack(Session.get('folderId'));
    for(var i = 0; i < projectStack.length; i++) {
     constructBreadcrumbs(title,projectStack[i]);
   }
 }

  //Empty the DOM
  $('#projectFolders').empty();


  folderData.forEach(function(child){
    $('#projectFolders').append(Template['project_folder'](child));

  });

  var projectFiles = $('#projectFiles');
  projectFiles.empty();

   fileData.forEach(function(child){
    $('#projectFiles').append(Template['project_file'](child));

  });

 return folderData;
};

getProjectStack = function(folderId){
  var stack = [];
  var myFolder = Folders.findOne({_id: folderId});
  stack.push({name: myFolder.name, folderId: myFolder._id});
  while(myFolder.parentId !== "none"){
    console.log(stack);
    myFolder = Folders.findOne({_id: myFolder.parentId});
    stack.push({name: myFolder.name, folderId: myFolder._id});
  }
  
  return stack;
};

enterFolder = function (element) {
 var folderClicked = $(element).attr('id');
 Session.set('folderId', folderClicked);
 console.log(Session.get('folderId'));

	//construct the project from the found folderData
	var folderData = constructProject();
};

function constructBreadcrumbs (title, folderData) {
    //Adjust the breadcrumbs
    console.log(folderData);
    title.html(title.html() + "/" +  "<span class='headerLink' id='header-" + folderData.folderId + "'>" + folderData.name + "</span>");
  }
