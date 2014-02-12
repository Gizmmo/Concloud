Template.updateHRModal.events({
	'click #hrData' : function (event) {
		clearBackground(event, "hrData");
	},
	'keypress' : function() {
        if(event.which === 13){
          clearBackground();
          updateHR();
        }
    },
	'click #hr-update-btn': function () {
		updateHR();
	}
});

function updateHR(){
	var sickDays = $("#sick-days").val();
		var vacationDays = $("#vacation-days").val();
		Meteor.users.update({_id: clickedID}, {$set:{"profile.hr.sickDays": sickDays, "profile.hr.vacationDays": vacationDays,}});
	
}