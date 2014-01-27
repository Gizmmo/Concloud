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
		if(Meteor.user().profile.userGroup == "Admin"){
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

		var options = {sort: {"recentUpdate.updateDate" : -1}};
		return Projects.find({_id : { $in: ids}}, options).map(function(project) {
			project = createProject(project, i);
			i += 1;
			return project;
		});
	},

        removeHeight : function() {
	    $('body').css('height', "auto");
	},

	userName : function() {
		return Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName ;
	},

	userGroup : function() {
		return Meteor.user().profile.userGroup;
	},

	joinDate : function() {
		return formatDate(Meteor.user().profile.joinDate);
	},

	lastLogin : function() {
		var lastLogin = Meteor.user().profile.recent.lastLogin;

		if(lastLogin === undefined || lastLogin === null)
			return 'First Time';
		return formatDate(lastLogin);
	},

	isProject : function(){
		var lastProject = Meteor.user().profile.recent.lastProjectID;
		if(lastProject === undefined || lastProject === null || lastProject === "None"){
			return false;
		}
		return true;
	},

	lastProjectID : function() {
		return Meteor.user().profile.recent.lastProjectID;
	},

	lastProject : function() {
		var lastProject = Meteor.user().profile.recent.lastProjectName;
		if(lastProject === undefined || lastProject === null || lastProject === "None")
			return 'No Project';
		return lastProject;
	},

	sickDays : function() {
		return Meteor.user().profile.hr.sickDays;
	},

	vacationDays : function() {
		return Meteor.user().profile.hr.vacationDays;
	}


});

Template.dashboard.created = function() {
  $('body').removeClass("modal-open");  
  $('body').height('auto');
  console.log("check here");
  console.log($('body'));
};

