Folders = new Meteor.Collection('folders');

Meteor.methods({

  createFolder : function(folder){
  	var newFolder = _.extend(_.pick(projectAttributes, 'name', 'parentId', 'parentName', 'projectId', 'projectName'), {
    	updated: new Date().getTime()
    });

    Folders.insert(newFolder);
  },

  removeFolder: function(folder){
  	var childrenFolders = Folders.find({parentId : folder._id});

	//ENTER SMARTFILE LOGIC HERE
  	//
  	

  	childrenFolders.forEach(function (child) {
  		Meteor.call('removeFolder', child, function (error, result) {});
  	});

    Folders.remove(folder._id);
  },

  updateFolder: function(folder){
  	Folders.update({"_id": folder._id}, folder, function(){});
  },

  setParent: function(currentFolder, parentFolder){
  	Folders.update({'_id': currentFolder._id}, {$set: {'parentId': parentFolder._id, 'parentName': parentFolder.name}});
  },

  changeName: function(folder, name){
  	var current = Folders.findOne({_id: folder._id});
  	Folders.update({'_id': currentFolder._id}, {$set: {'name': name}});

  	var folders = Folders.find({parentId: current.parentId});

  	folders.forEach(function (found) {
  		Meteor.call('setParent', found, current);
  	});

  	//CHANGE FILE PARENT NAMES AS WELL
  }


});
