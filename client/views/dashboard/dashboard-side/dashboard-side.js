Template.dashboardside.helpers({
	hrEntries: function (){
		var hr = HR.findOne({userId: Meteor.user()._id});
		if(HR.findOne({userId: Meteor.user()._id})){
			return  sortHR(HR.findOne({userId: Meteor.user()._id}).hrValues);
		} else {
			return [];
		}
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

	atConcord  : function(){
		if(Meteor.user().profile.userGroup === "Office Manager" || Meteor.user().profile.userGroup === "Employee"){
			return true;
		}else{
			return false;
		}
	},

	isProject : function(){
		var lastProject = Meteor.user().profile.recent.lastProjectID;
		if(lastProject === undefined || lastProject === null || lastProject === "None"){
			return false;
		}
		return true;
	},

	isOfficeManager : function() {
		return (Meteor.user().profile.userGroup === "Office Manager");
	},

	getSpace : function(){
		return (Session.get('smartFileSize'));
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

Template.dashboardside.events({
	'click #lastProj': function () {
		Router.go('projectPage', {_id: Meteor.user().profile.recent.lastProjectID});
	}
});

function sortHR(data){
	outputArray = [];
	var totalTimes = data.length;
	for(var i = 0; i < totalTimes; i++){
		var index = 0;
		for(var x = 0; x < data.length; x++){
			if(data[index].name > data[x].name){
				index = x;
			}
		}
		outputArray.push(data[index]);
		data.splice(index, 1);
	}

	return outputArray;
}