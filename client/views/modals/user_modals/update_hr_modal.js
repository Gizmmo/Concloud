Template.updateHRModal.events({
	'click #hrData' : function (event) {
		if($(event.target).attr('id')!=="hr-update-btn"){
			clearBackground(event, "hrData");
		}
	},
	'keypress' : function(event) {
        if(event.which === 13){
          updateHR(event);
        }
    },
	'click #hr-update-btn': function (event) {
		updateHR(event);
	}
});

function updateHR(event){
	var sickDays = $("#sick-days").val();
	var vacationDays = $("#vacation-days").val();
	Meteor.users.update({_id: clickedID}, {$set:{"profile.hr.sickDays": sickDays, "profile.hr.vacationDays": vacationDays,}});
	clearBackground(event, "hrData");
}