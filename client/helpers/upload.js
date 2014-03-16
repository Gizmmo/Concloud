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
          var currentFolder = createFoldersOnServer(pathStack, projectData);
          if(typeof currentFolder !== 'undefined'){
            uploadFile(files[i], projectData, filePath, timeStamp);
            addToDatabase(files[i], currentFolder);
          // removeEmptyString(currentFolder);
        }

      }else{

        upload(files[i],projectData, folder, timeStamp);
      }
    }

    createUploadNotification
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

  if(typeof file.name !== 'undefined' && file.name !== "" && file.name !== "."){
    if(typeof path === 'undefined'){
      path = getDirectoryFromStack(projectData, true);
    }

    console.log(path);

    sf.upload(file, {
      file: file.name.replace(/\s/g, "%20"),
      path : path
    },

    function (err, res){
      if (err) {
       console.log("upload failed", err);
       return;
     }
     var amount = parseInt(Session.get("uploadedAmount"+timeStamp)) + 1;
     if(amount === parseInt(Session.get('uploadAmount'+timeStamp))){
      Meteor.call('createUploadNotification', projectData, function(err, res){
        if(err){
          console.log(err);
        }
      });
    }else{
      Session.set("uploadedAmount"+timeStamp, amount);
    }
  });
  }
}

function removeEmptyString(folderData){
  delete folderData.files[""];
}

function addToDatabase(file, folder){
  if(typeof file.name !== 'undefined' && file.name !== "" && file.name !== "."){
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
}

function createFoldersOnSmartfile(createPath){
  Meteor.call('createDirectory', createPath, function (error, result) {
    if(error)
      console.log(error);
  });
}

function createFoldersOnServer(folderStack, projectData){

  if(folderStack.length === 0){
    return;
  }

  if(typeof folderStack !== 'undefined'){

    var stack = getPathStack(Session.get('thisId'));
    if(stack.length > 0){
      var tail = stack.pop();
      var parent = {_id: tail.folderId, name: name, projectName: projectData.title, projectId: projectData._id};
    }else{
     var parent = {_id: 'none', name: 'none', projectName: projectData.title, projectId: projectData._id};
   }
   for (var i = 0; i < folderStack.length; i++) {
    var myFolder = folderStack[i];
    var checkFolder = Folders.findOne({name: myFolder, projectId: projectData._id, parentId: parent._id});
    var parentId;
    if (typeof checkFolder === 'undefined'){
      var temp = createFolder(myFolder, parent);
      parentId = createFolderWithId(temp);
      console.log("created: " + parentId);

    }else{
      parentId = checkFolder._id;
    }

    parent = {_id: parentId, parentName: myFolder, projectName: projectData.title, projectId: projectData._id};

  }

  return parent;
}
}

function createFolderWithId(temp){
  var id = Random.id();
  Meteor.call('createFolderWithId', temp, id, function(err, res){
    if(err){
      console.log(err);
    }
  });
  return id;
}

