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
        Meteor.call('cleanUserNotifications', sub.userID, function (error, result) {});
      }
    });
  },

  createUploadNotification: function(project) {
    var user = Meteor.user();
    var found = Notifications.find({'userID': user._id, 'projectID': project._id, 'type': "Upload"}, {sort : {"submitted" : -1}}).fetch();
    if(found.length > 0){
      if(numSecondsBetween(found[0].submitted, (new Date().getTime())) > 2.0) {
        var notification = {
          userID: user._id,
          projectID: project._id,
          title: project.title,
          submitted: new Date().getTime(),
          type: "Upload"
        }
        Notifications.insert(notification);
        Meteor.call('cleanUserNotifications', user._id, function (err, result) {
          if(err)
            console.log(err);
        }); 
      }
    } else {
        var notification = {
          userID: user._id,
          projectID: project._id,
          title: project.title,
          submitted: new Date().getTime(),
          type: "Upload"
        }
        Notifications.insert(notification);
        Meteor.call('cleanUserNotifications', user._id, function (error, result) {}); 
    }
  },

  deleteNotification: function(notification){
    Notifications.remove({_id: notification._id});
  },

  cleanUserNotifications: function(userId){
    var notifications = Notifications.find({'userID': userId}, {sort : {"submitted" : -1}}).fetch();
    var limitLength = 5;
    while(notifications.length > limitLength){
      var i = notifications.length-1;
      Meteor.call('deleteNotification', notifications[i], function(){});
      notifications.pop();
    }
  }
});

var numSecondsBetween = function(d1, d2) {
  var diff = Math.abs(d1 - d2);
  return diff / (1000);
};