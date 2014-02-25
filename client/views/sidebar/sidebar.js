Template.menu.rendered = function () {
	
metroNotifications();
/**
 * Create Sidebar Menu
 */
	initAce();
	ace_elements();
	ace_extra();

$("[rel='tooltip']").tooltip();
};

Template.menu.helpers({
	projectListOk: function () {
		user = Meteor.user();
		if(user.profile.userGroup === "Admin" || user.profile.userGroup === "Office Manager" || user.profile.userGroup === "Employee" || user.profile.userGroup === "Client"){
			return true;
		}
		return false;
	},
	subTradeOk: function () {
		user = Meteor.user();
		if(user.profile.userGroup == "Sub-Trade"){
			return true;
		}
		return false;
	},
	admin: function () {
		user = Meteor.user();
		if(user.profile.userGroup == "Admin" || user.profile.userGroup == "Office Manager"){
			return true;
		}
		return false;
	},

	projects: function () {
		var returnProjs = new Meteor.Collection(null);
		subs = Subscriptions.find({userID:Meteor.user()._id});

		subs.forEach(function (sub) {
			var proj = Projects.findOne({"_id": sub.projectID});
			returnProjs.insert(proj);
		});

		return returnProjs.find({}, {sort: {"recentUpdate.updateDate" : -1}, limit: 5});
	},

	isProjects : function () {
		return Subscriptions.find({userID:Meteor.user()._id}).count()>0?true:false;

	}
});

Template.menu.events({
	"click #createSideBtn" : function () {
		if(user.profile.userGroup == "Admin" || user.profile.userGroup == "Office Manager"){
			$("#createSideProj").modal("toggle");
			$('#create-side-title').val("");
			$('#create-side-description').val("");
			$("#incorrect-fill-label").text("");
		}
		closeTips();
	},
	"click #accountBtn" : function () {
		$("#updatePass").modal("toggle");
		$('#old-password').val("");
		$('#sign-password').val("");
		$('#sign-confirm-password').val("");
		$("#incorrect-label").text("");
		$("#not-match-label").text("");
		closeTips();
	},
	'click': function () {
		closeTips();
	},
	'click #subbtn': function () {
		Router.go('contractsList')
	}
});

function closeTips() {
		$('.ui-tooltip').remove();
}