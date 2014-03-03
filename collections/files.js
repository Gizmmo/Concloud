Files = new Meteor.Collection('files');

Meteor.methods({

  createFile: function(file){
  	var newFile = _.extend(_.pick(projectAttributes, 'name', 'parentId', 'parentName', 'projectId', 'projectName'), {
    	updated: new Date().getTime()
    });

    Files.insert(newFile);
  },

  removeFile: function(file){
    Files.remove(file._id);
  },

  updateFile: function(file){
  	Files.update({"_id": file._id}, file, function(){});
  },

  setFileParent: function(currentFile, parentFolder){
  	Files.update({'_id': currentFile._id}, {$set: {'parentId': parentFolder._id, 'parentName': parentFolder.name}});
  },

  changeFileName: function(file, name){
  	Files.update({'_id': file._id}, {$set: {'name': name}});
  }


});
