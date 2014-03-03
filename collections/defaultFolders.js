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
  }
});
