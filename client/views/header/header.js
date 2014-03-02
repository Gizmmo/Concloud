Template.header.events({
	/**
	 * Logs the user out on click
	 * @return void
	 */
	'click #logout-btn' : function(){
		Meteor.users.update({_id: Meteor.userId()}, {$set : {'profile.recent.lastLogin' : new Date().getTime() } });
		Meteor.logout();
	},
});

Template.header.helpers({
	/**
	 * Gets the first name of the current user
	 * @return String String value of first name
	 */
	'currentName' : function(){
		return Meteor.user().profile.firstName;
	},

	notSub: function() {
		var user = Meteor.user();
		if(user.profile.userGroup == "Sub-Trade"){
			return false;
		}
		return true;
	},

	sub: function () {
			Meteor.subscribe('projects', Meteor.user().profile.userGroup);
			Meteor.subscribe('notifications');
			Meteor.subscribe('subscriptions');
			Meteor.subscribe('users', Meteor.user().profile.userGroup);
			Meteor.subscribe('hrData', Meteor.user().profile.userGroup);
			Meteor.subscribe('hr', Meteor.user().profile.userGroup);
			Meteor.subscribe('folders');
			Meteor.subscribe("my_channel");
		}
});