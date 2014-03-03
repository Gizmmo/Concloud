var sf = new SmartFile({});

smartFileFolder = function(template){
  var files = template.files;
  var projectData = Projects.findOne({_id: Session.get("currentProject")});
  var folderData = getFolderData(projectData);
  counter = 0;
  Session.set("uploadAmount", files.length);
  Session.set("uploadedAmount", 0);
  var uniqueFolders = [];
      //Download Folder(s)
      for (i = 0; i< files.length; i++) {


        //Collect Folder Path
        var path = files[i].webkitRelativePath;
        var pathStack = path.split("/");
        pathStack.pop();
        pathStack.shift();
        var tempPath = "";
        console.log(pathStack);

        for (var j = 0; j < pathStack.length; j++) {
          tempPath += pathStack[j];
        }

        if($.inArray(tempPath, uniqueFolders)===-1){
          console.log('in array check');
          uniqueFolders.push(tempPath);
          var amount = parseInt(Session.get('uploadedAmount')) + 1;
          Session.set("uploadedAmount", amount);
        }

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
          uploadFile(files[i], projectData, filePath, currentFolder);
          addToDatabase(files[i], currentFolder);
          removeEmptyString(currentFolder);

        }else{

          upload(files[i],projectData, folderData);
        }
      }
      // Meteor.setTimeout(function(){
        // Session.set("uploadingData", false);
      // },5000);


};

smartFileFile = function(template){
 var projectData = Projects.findOne({_id: Session.get("currentProject")});
 var folderData = getFolderData(projectData);
 var file = template.files[0];
 if(getFolderStack().length > 0){
  Session.set("uploadedAmount", 0);
  Session.set("uploadAmount", 1);
  upload(file,projectData, folderData);
}else{
 alert("You can only upload a file within a folder.");
}

};

function upload(file, projectData, folderData){
  uploadFile(file,projectData, folderData);
  addToDatabase(file, folderData);
  removeEmptyString(folderData);
}

function uploadFile(file,projectData,path, folderData){

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

   var amount = parseInt(Session.get("uploadedAmount")) + 1;
   if(amount === parseInt(Session.get('uploadAmount'))){
    console.log("in set false");
    Meteor.call('createUploadNotification', projectData, function(err, res){
      if(err){
        console.log(err);
      }
    });
    Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);
  }else{
    Session.set("uploadedAmount", amount);
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
      fileName = nameSplit[0]+nameSplit[1];
    }else{
      type = "none";
    }

    //Create File
    folderData.files[fileName] = createFile(fileName, type);
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

