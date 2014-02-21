var sf = new SmartFile({});

Template.uploadModal.helpers({
  onFile : function() {
    return (Session.get("uploadType")==="file");
  }
});

Template.uploadModal.events({
  'click #uploadData' : function (event) {
    clearBackground(event, "uploadData");
  },
  'keypress' : function() {
    if(event.which === 13){
      clearBackground();
      upload();
    }
  },
    /**
     * Upload file to Smart file and to our database
     * @param  {[type]} e        event returned
     * @param  {[type]} template Parameter of the used template
     */
     'click #smartfile': function (e, template) {
       var files = template.find('#upload-folder').files;
       var projectData = Projects.findOne({_id: Session.get("currentProject")});
       var folderData = getFolderData(projectData);
       counter = 0;
      //Download Folder(s)
      if(files.length !== 0){
       for (i = 0; i< files.length; i++) {
        Session.set("uploadingData", true);

        //Collect Folder Path
        var path = files[i].webkitRelativePath;
        var pathStack = path.split("/");
        pathStack.pop();
        pathStack.shift();

        var createPath = getDirectoryFromStack(projectData, false);
        var filePath = getDirectoryFromStack(projectData, true);

        if(pathStack.length > 0){
          for (var j = 0; j < pathStack.length; j++) {
            if(j > 0){
              createPath += "/";
              filePath += "/";
            }
            filePath += pathStack[j].replace(/\s/g, "%20");
            createPath += pathStack[j];
          }
          filePath += "/";
          createFoldersOnSmartfile(createPath);
          var currentFolder = createFoldersOnServer(pathStack, projectData, folderData);
          uploadFile(files[i], projectData, filePath);
          addToDatabase(files[i], currentFolder);
          removeEmptyString(currentFolder);

        }else{

          upload(files[i],projectData, folderData);
        }
      }
      Meteor.setTimeout(function(){
        Session.set("uploadingData", false);
      },5000);
      Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);

    //Download Single File
  }else{

    var file = template.find('#upload-file').files[0];
    if(getFolderStack().length > 0){
     Session.set("uploadingData", true);
     upload(file,projectData, folderData);
     Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);
   }else{
     alert("You can only upload a file within a folder.");
   }
 }
},
'click #file-upload' :function () {
  if(Session.get("uploadType") != "file"){
    Session.set("uploadType", "file");
    $('#file-li').addClass('active');
    $('#folder-li').removeClass('active');
  }
},

'click #folder-upload' : function () {
  if(Session.get('uploadType') != 'folder'){
    Session.set('uploadType', 'folder');
    $('#folder-li').addClass('active');
    $('#file-li').removeClass('active');
  }
}
});

function upload(file, projectData, folderData){
  console.log("Upload file");
  console.log(file);
  uploadFile(file,projectData);
  addToDatabase(file,folderData);
  removeEmptyString(folderData);
  runUpdate();
}

function uploadFile(file,projectData,path){

  if(typeof path === 'undefined'){
    path = getDirectoryFromStack(projectData, true);
  }
  sf.upload(file, {
    file: file.name,
    path : path
  },

  function (err, res){
    if (err) {
     console.log("upload failed", err);
     return;
   }
 });
}

function removeEmptyString(folderData){
  delete folderData.files[""];
}

function addToDatabase(file, folderData){

    //Find the document type by splitting on the .
    var nameSplit = file.name.split(".");
    var type = "";
    var fileName = file.name;
    if(nameSplit.length > 0){
      //get type after .
      type = nameSplit[1];
      //Collect file name without .
      fileName = nameSplit[0];
    }else{
      type = "none";
    }

    //Create File
    folderData.files[nameSplit[0]] = createFile(nameSplit[0], type);
  }

  function runUpdate(){
    Session.set("uploadingData", false);
  }

  function createFoldersOnSmartfile(createPath){
    Meteor.call('createDirectory', createPath, function (error, result) {
      if(error)
        console.log(error);
    });
  }

  function createFoldersOnServer(folderStack, projectData, folderData){

    if(folderStack.length === 0){
      return;
    }

    var currentFolders = folderData;
    for (var i = 0; i < folderStack.length; i++) {
      if(!(folderStack[i] in currentFolders.folders)){
       currentFolders.folders[folderStack[i]] = createFolder(folderStack[i], folderStack[i]);
     }

     currentFolders = currentFolders.folders[folderStack[i]];
   }

   return currentFolders;
 }

