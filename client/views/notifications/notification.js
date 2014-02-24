Template.notification.events({
	/**
	 * Changes the clicked notification to read
	 * @return void
	 */
  'click a': function() {
  	var proj = this;
    Meteor.call('deleteNotification', proj, function (error, result) {});
  }
});

Template.notification.rendered = function () {
	$("[rel='tooltip']").tooltip();
};