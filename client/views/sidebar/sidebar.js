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
		console.log(Subscriptions.find({userID:Meteor.user()._id}).count()>0?true:false);
		return Subscriptions.find({userID:Meteor.user()._id}).count()>0?true:false;

	}
});

Template.menu.events({
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