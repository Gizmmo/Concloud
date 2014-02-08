Template.notifications.helpers({
	/**
	 * Returns all unread notifications for the current user
	 * @return Collection All undread notifications for the current user
	 */
  notifications: function() {
    $("[rel='tooltip']").tooltip();
    notifications = Notifications.find({userID: Meteor.userId()}, {sort : {"submitted" : -1}});
    notifications.forEach(function (post, index) {
      if(index > 4){
        Notifications.remove({_id: post._id});
      }
    });
    return notifications;
  },
  /**
   * Returns the amount of notifications there are for the current user
   * @return int Amount of notifications for the current user
   */
  notificationCount: function(){
    return Notifications.find({userID: Meteor.userId()}).count();
  }
});

Template.notifications.events({
  'click #readAll': function () {
    var notifications = Notifications.find({userID: Meteor.userId()});
    notifications.forEach(function (post) {
      Notifications.remove({_id: post._id});
    });
  }
});