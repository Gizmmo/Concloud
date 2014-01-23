var clickedID = null;
var masterEmps = new Meteor.Collection(null);
var workingEmps = new Meteor.Collection(null);
var onDelete;

Template.userList.helpers({
	/**
	 * Finds all projects
	 * @return collection All projects in collection
	 */
	users: function() {
		masterEmps = new Meteor.Collection(null);
		var employees = Meteor.users.find({});
	
		employees.forEach(function (employee){
			masterEmps.insert(employee);
		});
		return workingEmps.find({}, {sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
	},

	convertedTime: function () {
		if(this.profile.recent){
			if(this.profile.recent.lastLogin){
				return formatDate(this.profile.recent.lastLogin);
			}
		}
		return formatDate(new Date().getTime());
	},

	dataToggle: function () {
		if(onDelete){
			return "#deleteData";
		}
		return "#updateData";
	},
	badgerData: function () {
		if(onDelete){
			return "badger-danger badger-right";
		}
		return "badger-info badger-left";
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
		$("#delete-email").text(this.profile.email)
		$("#first-name").text(this.profile.firstName);
		$("#first-delete-name").text(this.profile.firstName);
		$("#last-name").text(this.profile.lastName);
		$("#last-delete-name").text(this.profile.lastName);
		$("div.controls select").val(this.profile.userGroup);
		$("#last-logged-label").text(formatDate(this.profile.recent.lastLogin));
		if(this.profile.recent.lastProjectName){
			$("#last-worked-label").text(this.profile.recent.lastProjectName);
		} else{
			$("#last-worked-label").text("None");
		}
		clickedID = this._id;
	},
	'click #delbtn' : function () {
		onDelete = !onDelete;
		if(onDelete){
			$( ".b-user-item" ).removeClass( "badger-info badger-left" ).addClass( "badger-danger badger-right" );
			var boxes = $( ".b-user-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "#deleteData");
			}
			//data-target="#updateData
		} else{
			$( ".b-user-item" ).removeClass( "badger-danger badger-right" ).addClass( "badger-info badger-left" );
			var boxes = $( ".b-user-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "#updateData");
			}
		}
	},

	'click #delete-user' : function () {
		workingEmps.remove({_id: clickedID});
		Meteor.users.remove({_id: clickedID});

	},

	'click #update-user': function () {
		var firstName = $("#first-name").val();
		var lastName = $("#last-name").val();
		var userGroup = $("#user-group").val();
		Meteor.users.update({_id: clickedID}, {$set:{"profile.firstName": firstName, "profile.lastName": lastName, "profile.userGroup": userGroup}})
		masterEmps.update({_id: clickedID}, {$set:{"profile.firstName": firstName, "profile.lastName": lastName, "profile.userGroup": userGroup}})
		workingEmps.update({_id: clickedID}, {$set:{"profile.firstName": firstName, "profile.lastName": lastName, "profile.userGroup": userGroup}})
	},
		/**
	 * Creates a projects and inserts it in the project collection
	 * @param  Event event The event of clicking the button
	 * @return void
	 */
	'click #create-user': function (event) {
		console.log("Hello");
		var createdID;

		var time = new Date().getTime();
		var options = {
			email : $('#email').val(),
			password : 'password',
                //Profile is the object within the user that can
                //be freely edited by the user
            profile : {
				firstName : capitalizeFirstLetter($('#first-create-name').val()),
				lastName: capitalizeFirstLetter($('#last-create-name').val()),
				email: $("#email").val().toLowerCase(),
				userGroup : capitalizeFirstLetter($('#user-create-group').val()),
				joinDate: time,
				recent: {
					lastLogin: time,
					lastProjectName: "None",
					lastProjectID: "None"
					},
				hr : {
					sickDays: 0,
					vacationDays: 0,
                    //Updates in an arryay conataining update objects
                    //that contain a value, and how it has changed
					updates : [{
						hrValue: "User",
						valueChanged: "Was Created"
					}]
                }
            }
        };
        Meteor.call('createNewUser', options, function (error, id) {
    		createdID = id;
    		empl = Meteor.users.findOne({"_id" : createdID});
    		workingEmps.insert(empl);
    	});
    	    $("#search-emp-field").val("");
    		updateEmpAdd("");


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
	onDelete = false;
};