Template.notification.events({
	/**
	 * Changes the clicked notification to read
	 * @return void
	 */
  'click a': function() {
  	var proj = this;
    Meteor.call('deleteNotification', proj, function (error, result) {});
    Router.go('projectPage', {"_id": this._id});

  }
});

Template.notification.rendered = function () {
	$("[rel='tooltip']").tooltip();
};

Template.notification.helpers({
	projectType: function () {
		if(this.type === "Project"){
			return true;
		}
		return false;
	},

	uploadType: function () {
		if(this.type === "Upload"){
			return true;
		}
		return false;
	}
});