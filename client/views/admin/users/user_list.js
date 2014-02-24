clickedID = null;
onUserDelete = false;
onUserHR = false;

Template.userList.helpers({
	/**
	 * Finds all projects
	 * @return collection All projects in collection
	 */
	 users: function() {
	 	return Meteor.users.find({}, {sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
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

function updateView(searchValue) {
	if(searchValue == undefined || searchValue == null || searchValue == ""){
		users = Meteor.users.find({});
		users.forEach(function (user) {
			$('#' + user._id).show();
		});
	}else {
		users = Meteor.users.find({});
		users.forEach(function (user) {
			searchStrings = searchValue.trim().split(" ");
			var found = true;
			for (var i = 0; i < searchStrings.length; i++) {
				if(user.profile.firstName.toLowerCase().indexOf(searchStrings[i].toLowerCase() ) === -1 && user.profile.lastName.toLowerCase().indexOf(searchStrings[i].toLowerCase() ) === -1){
					found = false;
				}
			}

			if(found){
				$('#' + user._id).show();
			}

			if(!found){
				$('#' + user._id).hide();
			}

		});
	}
}

Template.userList.events({
	'keyup' : function () {
		updateView($("#search-field").val());
		
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
	 	if(onUserDelete){
	 		$( ".b-user-item" ).removeClass( "badger-info badger-warning badger-left" ).addClass( "badger-danger badger-left" );
	 		var boxes = $( ".b-user-item" );
	 		for(var i = 0; i < boxes.length; i++){
	 			userID = $(boxes[i]).attr("id");
	 			tempUser = Meteor.users.findOne({"_id":userID});
	 			$(boxes[i]).attr("data-target", "");
	 			$(boxes[i]).append('<i class="fa fa-times fa-2x close-x" id="close-x" title="Delete Project" rel="tooltip"></i>');
	 			$("[rel=tooltip").tooltip();
	 			if(onUserHR){
	 				removeHR($(boxes[i]));
	 			}
	 		}
	 	} else{
	 		$( ".b-user-item" ).removeClass( "badger-danger badger-warning badger-left" ).addClass( "badger-info badger-left" );
	 		var boxes = $( ".b-user-item" );
	 		for(var i = 0; i < boxes.length; i++){
	 			userID = $(boxes[i]).attr("id");
	 			tempUser = Meteor.users.findOne({"_id":userID});
	 			$(boxes[i]).attr("data-target", "#updateData");
	 			$('i').remove('#close-x');
	 		}
	 	}
	 	onUserHR = false;
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
	}
});

Template.userList.created = function () {
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