Template.logged.rendered = function () {
if(Meteor.user() && ! Meteor.loggingIn()){
	Meteor.subscribe('projects', Meteor.user().profile.userGroup);
	Meteor.subscribe('notifications');
	Meteor.subscribe('subscriptions');
	Meteor.subscribe('users', Meteor.user().profile.userGroup);
	Meteor.subscribe('hrData', Meteor.user().profile.userGroup);
	Meteor.subscribe('hr', Meteor.user().profile.userGroup);
	Meteor.subscribe('folders');
	Meteor.subscribe("my_channel");
}
};