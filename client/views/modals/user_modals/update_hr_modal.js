Template.updateHRModal.events({
	'click #hr-update-btn': function () {
		var sickDays = $("#sick-days").val();
		var vacationDays = $("#vacation-days").val();
		Meteor.users.update({_id: clickedID}, {$set:{"profile.hr.sickDays": sickDays, "profile.hr.vacationDays": vacationDays,}});
	}
});