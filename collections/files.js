Files = new Meteor.Collection('files');

Meteor.methods({

  createFile: function(file){
  	var newFile = _.extend(_.pick(file, 'name', 'type', 'parentId', 'parentName', 'projectId', 'projectName'), {
     updated: new Date().getTime()
   });

    var found = Files.findOne({name: newFile.name, parentId: newFile.parentId});
    if(found){
      Meteor.call('removeFile', found, function(){});
    }

    project = Projects.findOne(newFile.projectId);
    Files.insert(newFile);
    Meteor.call("createProjectNotification", project);
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
