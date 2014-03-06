Template.notification.events({
 'click #clickedNotification' : function() {
 	var proj = this;
    Meteor.call('deleteNotification', proj, function (error, result) {});
    tooltip('destroy');
  	Router.go('projectPage', {_id: this.projectID});
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