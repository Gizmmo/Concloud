Template.menu.rendered = function () {
	
/**
 * Create Sidebar Menu
 */
	initAce();
	ace_elements();
	ace_extra();

};

Template.menu.helpers({
	projects: function () {
		return Subscriptions.find({userID:Meteor.user()._id}, {sort:{ created_at : -1}, limit: 5});
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
	}
});