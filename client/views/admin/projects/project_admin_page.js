var sf = new SmartFile({});


Template.projectAdminPage.events({
	'keyup' : function () {
		updateClientView($("#search-client-field").val());
		updateEmployeeView($("#search-field").val());
		
	}
});

function updateEmployeeView(searchValue){
		if(searchValue == undefined || searchValue == null || searchValue == ""){
		users = Meteor.users.find({});
		users.forEach(function (user) {
			$('#emp-avail-' + user._id).show();
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
				$('#emp-avail-' + user._id).show();
			}

			if(!found){
				$('#emp-avail-' + user._id).hide();
			}

		});
	}
}

function updateClientView(searchValue){
		if(searchValue == undefined || searchValue == null || searchValue == ""){
		users = Meteor.users.find({});
		users.forEach(function (user) {
			$('#client-avail-' + user._id).show();
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
				$('#client-avail-' + user._id).show();
			}

			if(!found){
				$('#client-avail-' + user._id).hide();
			}

		});
	}
}

function getSubIDs(role){
		subs = Subscriptions.find( {projectID: projectID, projectRole: role});
		var userIDs = new Array();

		subs.forEach(function (sub, index) {
			userIDs[index] = sub.userID;
		});


		return userIDs;
}

function getUserID(iDString){
	allStrings = iDString.trim().split("-");
	return allStrings[allStrings.length -1];
}

Template.projectAdminPage.helpers({
	employees : function () {
		projectID = this._id;
		projectTitle = this.title;
		var userIDs = getSubIDs("Project Employee");
		return Meteor.users.find({'_id' : { $nin: userIDs}, $or: [{"profile.userGroup": "Employee"}, {"profile.userGroup": "Office Manager"} ] },{sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
	
	},

	projectEmployees : function () {
		var userIDs = getSubIDs("Project Employee");
		return Meteor.users.find({'_id' : { $in: userIDs}}, {sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
	},
	clients : function () {
		var userIDs = getSubIDs("Project Client");
		return Meteor.users.find({'_id' : { $nin: userIDs}, "profile.userGroup": "Client"},{sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
	},
	projectClients : function () {
		var userIDs = getSubIDs("Project Client");
		return Meteor.users.find({'_id' : { $in: userIDs}},{sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
	}
});

Template.projectAdminPage.created = function () {
	projectID = this.data._id;
};

Template.projectAdminPage.rendered = function() {
    $( "#chosen-emps, #available-emps" ).sortable({
      connectWith: ".connectedSortable"
    }).disableSelection();
	$( "#chosen-emps, #available-emps" ).sortable({
      placeholder: "ui-state-highlight"
    }).disableSelection();

    $( "#chosen-clients, #available-clients" ).sortable({
      connectWith: ".connectedClientSortable"
    }).disableSelection();
	$( "#chosen-clients, #available-clients" ).sortable({
      placeholder: "ui-state-highlight"
    }).disableSelection();



 $( "#chosen-emps" ).sortable({
 	  	remove: function( event, ui ) {
  		},

		receive: function( event, ui ) {
  			current = $(ui.item);
  			var id = current.attr('id');
  			id = getUserID(id);
  			removedEmployee = Meteor.users.findOne( {"_id": id} );
  			sub = {
  				userID: removedEmployee._id,
  				projectID: projectID,
  				projectTitle: projectTitle,
  				projectRole: "Project Employee"
  			}
  			Meteor.call('subscription', sub, function (error, id) {
				if (error) {
            	} 
            	else {
            	}
        	});
  		},
	});


 $( "#available-emps" ).sortable({
  		remove: function( event, ui ) {
  		},

		receive: function( event, ui ) {
  			current = $(ui.item);
  			var id = current.attr('id');
  			id = getUserID(id);
  			removedEmployee = Meteor.users.findOne( {"_id": id} );
  			sub = {
  				userID: removedEmployee._id,
  				projectID: projectID
  			}
  			Meteor.call('removeSubscription', sub, function (error, id) {
				if (error) {
            	} 
            	else {
            	}
        	});
        	updateEmployeeView($("#search-field").val());
  		},
	});

$( "#chosen-clients" ).sortable({
 	  	remove: function( event, ui ) {
  		},

		receive: function( event, ui ) {
  			current = $(ui.item);
  			var id = current.attr('id');
  			id = getUserID(id);
  			removedEmployee = Meteor.users.findOne( {"_id": id} );
  			sub = {
  				userID: removedEmployee._id,
  				projectID: projectID,
  				projectTitle: projectTitle,
  				projectRole: "Project Client"
  			}
  			Meteor.call('subscription', sub, function (error, id) {
				if (error) {
            	} 
            	else {
            	}
        	});
  		},
	});


 $( "#available-clients" ).sortable({
  		remove: function( event, ui ) {
  		},

		receive: function( event, ui ) {
  			current = $(ui.item);
  			var id = current.attr('id');
  			id = getUserID(id);
  			removedEmployee = Meteor.users.findOne( {"_id": id} );
  			sub = {
  				userID: removedEmployee._id,
  				projectID: projectID
  			}
  			Meteor.call('removeSubscription', sub, function (error, id) {
				if (error) {
            	} 
            	else {
            	}
        	});
  			updateClientView($("#search-client-field").val());
  		},
	});
}