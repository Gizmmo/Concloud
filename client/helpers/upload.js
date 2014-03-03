var sf = new SmartFile({});

smartFileFolder = function(template, timeStamp){
  var files = template;
  var folder = Folders.findOne({_id: Session.get('thisId')});
  var projectData = Projects.findOne({_id: Session.get("currentProject")});
  counter = 0;
  Session.set("uploadAmount" + timeStamp, files.length);
  Session.set("uploadedAmount"+timeStamp, 0);
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
          var amount = parseInt(Session.get('uploadedAmount'+timeStamp)) + 1;
          Session.set("uploadedAmount"+timeStamp, amount);
        }



        var createPath = getDirectoryFromStack(projectData, false);
        var filePath = getDirectoryFromStack(projectData, true);
        var folderName = "";
        if(pathStack.length > 0){

          for (var k = 0; k < pathStack.length; k++) {
            if(k > 0){
              createPath += "/";
              filePath += "/";
            }
            filePath += pathStack[k].replace(/\s/g, "%20");
            createPath += pathStack[k];
          }
          filePath += "/";
          createFoldersOnSmartfile(createPath);
          var currentFolder = createFoldersOnServer(pathStack, projectData, folder);
          uploadFile(files[i], projectData, filePath, timeStamp);
          addToDatabase(files[i], folder);
          // removeEmptyString(currentFolder);

        }else{

          upload(files[i],projectData, folder, timeStamp);
        }
      }
      // Meteor.setTimeout(function(){
        // Session.set("uploadingData", false);
      // },5000);


};

smartFileFile = function(template, timeStamp){
 var projectData = Projects.findOne({_id: Session.get("currentProject")});
 var folder = Folders.findOne({_id: Session.get('thisId')});
 var file = template[0];

  Session.set("uploadedAmount"+timeStamp, 0);
  Session.set("uploadAmount"+timeStamp, 1);
  upload(file,projectData, folder, timeStamp);  

};

function upload(file, projectData, folder, timeStamp){
  uploadFile(file,projectData, getDirectoryFromStack(projectData, true), timeStamp);
  addToDatabase(file, folder);
  // removeEmptyString(folderData);
}

function uploadFile(file,projectData,path, timeStamp){

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

   var amount = parseInt(Session.get("uploadedAmount"+timeStamp)) + 1;
   console.log(amount);
   if(amount === parseInt(Session.get('uploadAmount'+timeStamp))){
    console.log("in set false");
    Meteor.call('createUploadNotification', projectData, function(err, res){
      if(err){
        console.log(err);
      }
    });
    Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);
  }else{
    Session.set("uploadedAmount"+timeStamp, amount);
  }
});
}

function removeEmptyString(folderData){
  delete folderData.files[""];
}

function addToDatabase(file, folder){

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

    var createdFile = {
      name: fileName,
      type: type,
      parentId : folder._id,
      parentName: folder.name,
      projectId: folder.projectId,
      projectName: folder.projectName
    };

    Meteor.call('createFile', createdFile, function(err,res){
      if(err){
        console.log(err);
      }
    });
  }

  function createFoldersOnSmartfile(createPath){
    Meteor.call('createDirectory', createPath, function (error, result) {
      if(error)
        console.log(error);
    });
  }

  function createFoldersOnServer(folderStack, projectData, folder){

    if(folderStack.length === 0){
      return;
    }
    var parent = {_id: 'none', name: 'none', projectName: projectData.name, projectId: projectData._id};
    for (var i = 0; i < folderStack.length; i++) {
      var myFolder = folderStack[i];
      var checkFolder = Folders.findOne({name: myFolder, projectId: projectData._id, parentId: parent._id});
      if (typeof checkFolder !== 'undefined'){
        Meteor.call(createFolder, createFolder(myFolder.name, parent), function(err, res){
          if(err){
            console.log(err);
          }
        });
      }

      parent = Folders.findOne({_name: myFolder, projectId: projectData._id, parentId: parent._id});
    }

  return currentFolders;
}

