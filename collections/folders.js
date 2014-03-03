Folders = new Meteor.Collection('folders');

Meteor.methods({

  createFolder : function(folder){
  	var permission = [];
  	if(folder.permissions){
  		permission = folder.permissions;
  	}

  	var newFolder = _.extend(_.pick(projectAttributes, 'name', 'parentId', 'parentName', 'projectId', 'projectName'), {
    	updated: new Date().getTime(),
    	permissions: permission
    });

    Folders.insert(newFolder);
  },

  removeFolder: function(folder){
	//ENTER SMARTFILE LOGIC HERE
  	//
  	
  	//REMOVES CHILDREN FOLDERS FROM COLLECTION
  	var childrenFolders = Folders.find({parentId : folder._id});
  	childrenFolders.forEach(function (child) {
  		Meteor.call('removeFolder', child, function (error, result) {});
  	});

  	//REMOVES CHILDREN FILES FROM COLLECTION
	var childrenFiles = Files.find({parentId : folder._id});
  	childrenFiles.forEach(function (child) {
  		Meteor.call('removeFile', child, function (error, result) {});
  	});

  	//REMOVE SELF
    Folders.remove(folder._id);
  },

  updateFolder: function(folder){
  	Folders.update({"_id": folder._id}, folder, function(){});
  },

  setFolderParent: function(currentFolder, parentFolder){
  	Folders.update({'_id': currentFolder._id}, {$set: {'parentId': parentFolder._id, 'parentName': parentFolder.name}});
  },

  changeFolderName: function(folder, name){
  	var current = Folders.findOne({_id: folder._id});
  	Folders.update({'_id': current._id}, {$set: {'name': name}});

  	//UPDATE CHILDREN FOLDERS
  	var folders = Folders.find({parentId: current._id});
  	folders.forEach(function (found) {
  		Meteor.call('setFolderParent', found, current);
  	});

  	//UPDATE CHILDREN FILES
  	var files = Files.find({parentId: current._id});
  	files.forEach(function (found) {
  		Meteor.call('setFileParent', found, current);
  	});
  }
});
