Notifications = new Meteor.Collection('notifications');

  /**
Notifications.allow({
  update: ownsDocument
});
**/


Meteor.methods({
  createProjectNotification: function(project) {
    var user = Meteor.user();
    var projectSubs = Subscriptions.find({projectID: project._id});
    projectSubs.forEach(function (sub) {
      if(sub.userID !== project.recentUpdate.updateAuthorID){
        var found = Notifications.findOne({'userID': sub.userID, 'projectID': project._id, 'type': "Project"});
        if(found){
          Meteor.call('deleteNotification', found, function() {});
        }
        Notifications.insert({
          userID: sub.userID,
          projectID: project._id,
          updateAuthorName: project.recentUpdate.updateAuthorName,
          title: project.title,
          submitted: new Date().getTime(),
          type: "Project"
        });
      }
    });
  },

  createUploadNotification: function(project) {
    var user = Meteor.user();
    var found = Notifications.findOne({'userID': user._id, 'projectID': project._id, 'type': "Upload"});
      if(found){
        Meteor.call('deleteNotification', found, function() {});
      }
    var notification = {
      userID: user._id,
      projectID: project._id,
      title: project.title,
      submitted: new Date().getTime(),
      type: "Upload"
    }
        Notifications.insert(notification);
  },

  deleteNotification: function(notification){
    Notifications.remove({_id: notification._id});
  }
});