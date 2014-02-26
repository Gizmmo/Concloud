Folders = new Meteor.Collection('folders');

Meteor.methods({

  addFolder : function(folder){
    return Folders.insert(folder);
  },

  removeFolder: function(folder){
    Folders.remove(folder._id);
  },

  updateFolder: function(folder){
  	Folders.update({"_id": folder._id}, folder);
  }
});
