function createProject(project, rank){
			project.description =  "This project has been recently updated.";
			project.name = project.title;
			project.submitted = project.recentUpdate.updateDate;
			project.author = project.recentUpdate.updateAuthorName;
			project.projectId = project._id;
			project._rank = rank;
			return project;
}

Template.dashboard.helpers({
	/**
	 * This will cycle through all collections that can be
	 * posted to the dashboard and sort them by date and
	 * check if the user is subscribed to wanted entry
	 * @return Array Contains objects of entries to be posted to the dashboard
	 */
	entry: function () {
		var user = Meteor.user();
		var ids = [];
		if(Meteor.user().profile.userGroup == "Admin" || Meteor.user().profile.userGroup == "Office Manager"){
			var projs = Projects.find();
			projs.forEach(function (post) {
				ids.push(post._id);
			});
		}else {
			var subs = Subscriptions.find({userID: user._id});
			subs.forEach(function (post) {
				ids.push(post.projectID);
			});
		}

		var i = 0;

		var options = {sort: {"recentUpdate.updateDate" : -1}, limit: 5};
		return Projects.find({_id : { $in: ids}}, options).map(function(project) {
			project = createProject(project, i);
			i += 1;
			return project;
		});
	},

    removeHeight : function() {
	    $('body').css('height', "auto");
	}
});

Template.dashboard.created = function() {
  $('body').removeClass("modal-open");  
  $('body').height('auto');
  Session.set("LoggedIn", true);
  Session.set("userGroup", Meteor.user().profile.userGroup);
}

