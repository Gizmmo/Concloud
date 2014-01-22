var clickedID = null;
var masterEmps = new Meteor.Collection(null);
var workingEmps = new Meteor.Collection(null);

Template.userList.helpers({
	/**
	 * Finds all projects
	 * @return collection All projects in collection
	 */
	users: function() {
		return workingEmps.find({}, {sort : {"profile.lastName" : 1, "profile.firstName" : 1}})
	},
	convertedTime: function () {
		if(this.profile.recent){
			if(this.profile.recent.lastLogin){
				return formatDate(this.profile.recent.lastLogin);
			}
		}
		return formatDate(new Date().getTime());
	}

});

function updateEmpRemove(searchString){
	masterEmps.find({}).forEach(function (employee) {
		if(searchString.length > 0){
			searchStrings = searchString.split(" ");
			var found = false;
			for (var i = 0; i < searchStrings.length; i++) {
				if(employee.profile.firstName.indexOf(searchStrings[i] ) != -1 || employee.profile.lastName.indexOf(searchStrings[i] ) != -1)
				found = true;
			}

			if(!found){
				workingEmps.remove(employee._id)
			}else {
			}
		}
	});
}

function updateEmpAdd(searchString){
	masterEmps.find({}).forEach(function (employee){
		if(!(workingEmps.findOne({"_id" : employee._id}))){
			if(employee.profile.firstName.indexOf(searchString) != -1 || employee.profile.lastName.indexOf(searchString) != -1){
				workingEmps.insert(employee);
			}
		}
	});
}

Template.userList.events({
		'keyup' : function () {
		searchEmpString = $("#search-emp-field").val();
		
		if(searchEmpString.length > searchEmpFieldLength){
			updateEmpRemove(searchEmpString);
		} else if (searchEmpString.length < searchEmpFieldLength){
			updateEmpAdd(searchEmpString);
		}
		searchEmpFieldLength = searchEmpString.length;
		
	},
	/**
	 * This will mimic an actual update to the current project
	 * @param  Meteor.call('updateProject', this._id, function (error, result) {		});	}} [description]
	 * @return {[type]}   [description]
	 */
	'click .b-user-item': function () {
		$("#first-name").text(this.profile.firstName);
		$("#last-name").text(this.profile.lastName);
		$("div.controls select").val(this.profile.userGroup);
		$("#last-logged-label").text(formatDate(this.profile.recent.lastLogin));
		if(this.profile.recent.lastProjectName){
			$("#last-worked-label").text(this.profile.recent.lastProjectName);
		} else{
			$("#last-worked-label").text("None");
		}
		clickedID = this._id;
	},
	'click #update-user': function () {
		var firstName = $("#first-name").val();
		var lastName = $("#last-name").val();
		var userGroup = $("#user-group").val();
		Meteor.users.update({_id: clickedID}, {$set:{"profile.firstName": firstName, "profile.lastName": lastName, "profile.userGroup": userGroup}})
		//Meteor.users.findOne({"_id" : clickedID});
	}
});

Template.userList.created = function () {

	masterEmps = new Meteor.Collection(null);
	workingEmps = new Meteor.Collection(null);

	searchEmpFieldLength = 0;
	employees = Meteor.users.find({});
	
	employees.forEach(function (employee){
		workingEmps.insert(employee);
		masterEmps.insert(employee);
	});
};