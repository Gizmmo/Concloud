DefaultFolders = new Meteor.Collection('defaultFolders');

Meteor.methods({

  addDefault : function(folder){
    return DefaultFolders.insert(folder);
  },

  removeDefault: function(folder){
    DefaultFolders.remove(folder._id);
  },

  updateDefault: function(folder){
  	DefaultFolders.update({"_id": folder._id}, folder);

  	var found = DefaultFolders.findOne({"_id": folder._id});
  	var folders = Folders.find({name: found.name, parentId: "none"}, {});
  	folders.forEach(function (post) {
  			post.permissions = found.permissions;
  			Meteor.call('updateFolder', post, function (error, result) {});
  		});
  }

});
