var clickedID = null;
masterEmps = new Meteor.Collection(null);
workingEmps = new Meteor.Collection(null);
onUserDelete = false;
onUserHR = false;

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
	 }

	});

function updateEmpRemove(searchString){
	searchString = searchString.toLowerCase();
	masterEmps.find({}).forEach(function (employee) {
		if(searchString.length > 0){
			searchStrings = searchString.split(" ");
			var found = false;
			for (var i = 0; i < searchStrings.length; i++) {
				if(employee.profile.firstName.toLowerCase().indexOf(searchStrings[i] ) != -1 || employee.profile.lastName.toLowerCase().indexOf(searchStrings[i] ) != -1)
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
	searchString = searchString.toLowerCase();
	masterEmps.find({}).forEach(function (employee){
		if(!(workingEmps.findOne({"_id" : employee._id}))){
			if(employee.profile.firstName.toLowerCase().indexOf(searchString) != -1 || employee.profile.lastName.toLowerCase().indexOf(searchString) != -1){
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
	 	$("#hr-email").text(this.profile.email);
	 	$("#sick-days").val(this.profile.hr.sickDays);
	 	$("#vacation-days").val(this.profile.hr.vacationDays);
	 	clickedID = this._id;
	 },
	 'click #delbtn' : function () {
	 	onUserDelete = !onUserDelete;
	 	onUserHR = false;
	 	if(onUserDelete){
	 		$( ".b-user-item" ).removeClass( "badger-info badger-warning badger-left" ).addClass( "badger-danger badger-left" );
	 		var boxes = $( ".b-user-item" );
	 		for(var i = 0; i < boxes.length; i++){
	 			userID = $(boxes[i]).attr("id");
	 			tempUser = Meteor.users.findOne({"_id":userID});
	 			$(boxes[i]).attr("data-target", "");
	 			$(boxes[i]).append('<i class="fa fa-times fa-2x close-x" id="close-x" title="Delete Project" rel="tooltip"></i>');
	 			$("[rel=tooltip").tooltip();
	 			removeHR();
	 		}
	 	} else{
	 		$( ".b-user-item" ).removeClass( "badger-danger badger-warning badger-left" ).addClass( "badger-info badger-left" );
	 		var boxes = $( ".b-user-item" );
	 		for(var i = 0; i < boxes.length; i++){
	 			userID = $(boxes[i]).attr("id");
	 			tempUser = Meteor.users.findOne({"_id":userID});
	 			$(boxes[i]).attr("data-target", "#updateData");
	 			$('i').remove('#close-x');
	 			removeHR();
	 		}
	 	}
	 },

	 'click #hrbtn': function () {
	 	onUserHR = !onUserHR;
	 	onUserDelete = false;
	 	if(onUserHR){
	 		$( ".b-user-item" ).removeClass( "badger-info badger-left badger-danger" ).addClass( "badger-warning badger-left" );
	 		var boxes = $( ".b-user-item" );
	 		for(var i = 0; i < boxes.length; i++){
	 			$(boxes[i]).attr("data-target", "#hrData");
	 			userID = $(boxes[i]).attr("id");
	 			tempUser = Meteor.users.findOne({"_id":userID});
	 			$('i').remove('#close-x');
	 			$("[rel=tooltip").tooltip();
	 			$('div').remove("#userInfo");
	 			$(boxes[i]).append('<div id="hrInfo">' +
	 				'<span class = "my-title">Email: </span>'+tempUser.profile.email+'<br>'+
	 				'<span class = "my-title"> Sick Days: </span>'+tempUser.profile.hr.sickDays+'<br>'+
	 				'<span class = "my-title">Vacation Days: </span>'+tempUser.profile.hr.vacationDays+
	 				'</div>');

	 		}
			//data-target="#updateData
		} else{
			$( ".b-user-item" ).removeClass( "badger-warning badger-right" ).addClass( "badger-info badger-left" );
			var boxes = $( ".b-user-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "#updateData");
				userID = $(boxes[i]).attr("id");
				tempUser = Meteor.users.findOne({"_id":userID});
				$('i').remove('#close-x');
				$("[rel=tooltip").tooltip();
				removeHR($(boxes[i]));
			}
		}
	},

	'click #update-user': function () {
		var firstName = $("#first-name").val();
		var lastName = $("#last-name").val();
		var userGroup = $("#user-group").val();
		Meteor.users.update({_id: clickedID}, {$set:{"profile.firstName": firstName, "profile.lastName": lastName, "profile.userGroup": userGroup}})
		masterEmps.update({_id: clickedID}, {$set:{"profile.firstName": firstName, "profile.lastName": lastName, "profile.userGroup": userGroup}})
		workingEmps.update({_id: clickedID}, {$set:{"profile.firstName": firstName, "profile.lastName": lastName, "profile.userGroup": userGroup}})
	},

	'click #hr-update-btn': function () {
		var sickDays = $("#sick-days").val();
		var vacationDays = $("#vacation-days").val();
		Meteor.users.update({_id: clickedID}, {$set:{"profile.hr.sickDays": sickDays, "profile.hr.vacationDays": vacationDays,}});
		masterEmps.update({_id: clickedID}, {$set:{"profile.hr.sickDays": sickDays, "profile.hr.vacationDays": vacationDays,}});
		workingEmps.update({_id: clickedID}, {$set:{"profile.hr.sickDays": sickDays, "profile.hr.vacationDays": vacationDays,}});
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
	onUserDelete = false;
};

Template.userList.rendered = function () {
	if(onUserDelete){
		$( ".b-user-item" ).removeClass( "badger-info badger-left" ).addClass( "badger-danger badger-left" );
		var boxes = $( ".b-user-item" );
		for(var i = 0; i < boxes.length; i++){
			$(boxes[i]).attr("data-target", "");
			$(boxes[i]).append('<i class="fa fa-times fa-2x close-x" id="close-x" title="Delete Project" rel="tooltip"></i>');
			$("[rel=tooltip").tooltip();
		}
	} else{
	}
};

function removeHR(item) {
	$('div').remove("#hrInfo");
	$(item).append('<div id="userInfo">' +
		'<span class = "my-title">Email: </span>'+tempUser.profile.email+'<br>'+
		'<span class = "my-title"> User Group: </span>'+tempUser.profile.userGroup+'<br>'+
		'<span class = "my-title"> Last Logged In: </span>'+convertedTime(tempUser)+
		'</div>');
}

function convertedTime(tempUser) {
	if(tempUser.profile.recent){
		if(tempUser.profile.recent.lastLogin){
			return formatDate(tempUser.profile.recent.lastLogin);
		}
	}
	return formatDate(new Date().getTime());
}