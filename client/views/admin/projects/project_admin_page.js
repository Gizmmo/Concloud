var sf = new SmartFile({});
	var masterEmployees = new Meteor.Collection(null);
	var workingEmployees = new Meteor.Collection(null);
	var projectEmployees = new Meteor.Collection(null);

	var masterClients = new Meteor.Collection(null);
	var workingClients = new Meteor.Collection(null);
	var projectClients = new Meteor.Collection(null);


Template.projectAdminPage.events({
	'keyup' : function () {
		searchString = $("#search-field").val();
		searchClientString = $("#search-client-field").val();
		
		if(searchString.length > searchFieldLength){
			updateRemove(searchString);
		} else if (searchString.length < searchFieldLength){
			updateAdd(searchString);
		}

		if(searchClientString.length > searchClientFieldLength){
			updateRemove(searchClientString);
		} else if (searchClientString.length < searchClientFieldLength){
			updateAdd(searchClientString);
		}

		searchFieldLength = searchString.length;
		searchClientFieldLength = searchClientString.length;
		
	}
});

function updateRemove(searchString){
	masterEmployees.find({}).forEach(function (employee) {
		if(searchString.length > 0){
			searchStrings = searchString.split();
			var found = false;
			for (var i = 0; i < searchStrings.length; i++) {
				if(employee.profile.firstName.indexOf(searchString[i] ) != -1 || employee.profile.lastName.indexOf(searchString[i] ) != -1)
				found = true;
			}

			if(!found){
				workingEmployees.remove(employee._id)
			}else {
			}
		}
	});
}

function updateAdd(searchString){
	masterEmployees.find({}).forEach(function (employee){
		if(!(workingEmployees.findOne({"_id" : employee._id}))){
			if(employee.profile.firstName.indexOf(searchString) != -1 || employee.profile.lastName.indexOf(searchString) != -1){
				workingEmployees.insert(employee);
			}
		}
	});
}

function updateClientRemove(searchString){
	masterClients.find({}).forEach(function (client) {
		if(searchString.length > 0){
			searchStrings = searchString.split();
			var found = false;
			for (var i = 0; i < searchStrings.length; i++) {
				if(client.profile.firstName.indexOf(searchString[i] ) != -1 || client.profile.lastName.indexOf(searchString[i] ) != -1)
				found = true;
			}

			if(!found){
				workingClients.remove(client._id)
			}else {
			}
		}
	});
}

function updateClientAdd(searchString){
	masterClients.find({}).forEach(function (client){
		if(!(workingClients.findOne({"_id" : client._id}))){
			if(client.profile.firstName.indexOf(searchString) != -1 || client.profile.lastName.indexOf(searchString) != -1){
				workingClients.insert(client);
			}
		}
	});
}

Template.projectAdminPage.helpers({
	employees : function () {
		projectID = this._id;
		projectTitle = this.title;
		return workingEmployees.find({}, {sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
	},

	projectEmployees : function () {
		return projectEmployees.find({}, {sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
	},
	clients : function () {
		return workingClients.find({}, {sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
	},
	projectClients : function () {
		return projectClients.find({}, {sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
	}
});

Template.projectAdminPage.created = function () {

	masterEmployees = new Meteor.Collection(null);
	workingEmployees = new Meteor.Collection(null);
	projectEmployees = new Meteor.Collection(null);
	projectClients = new Meteor.Collection(null);
	masterClients = new Meteor.Collection(null);
	workingClients = new Meteor.Collection(null);

	searchFieldLength = 0;
	searchClientFieldLength = 0;
	employees = Meteor.users.find({"profile.userGroup" : "Employee"});
	clients = Meteor.users.find({"profile.userGroup" : "Client"});
	projectID = this.data._id;
	

	employees.forEach(function (employee){
		sub = Subscriptions.findOne( { $and: [ { userID: employee._id}, {projectID: projectID } ] } )
		if(sub){
			role = sub.projectRole;
			if(role === "Project Employee"){
				projectEmployees.insert(employee);
			}
		} else{
			masterEmployees.insert(employee);
			workingEmployees.insert(employee);
		}
	});


	clients.forEach(function (client){
		sub = Subscriptions.findOne( { $and: [ { userID: client._id}, {projectID: projectID } ] } )
		if(sub){
			role = sub.projectRole;
			if(role === "Project Client"){
				projectClients.insert(client);
			}
		} else{
			masterClients.insert(client);
			workingClients.insert(client);
		}
	});
};

Template.projectAdminPage.rendered = function() {
    $( "#sortable1, #sortable2" ).sortable({
      connectWith: ".connectedSortable"
    }).disableSelection();
	$( "#sortable1, #sortable2" ).sortable({
      placeholder: "ui-state-highlight"
    }).disableSelection();

    $( "#sortable3, #sortable4" ).sortable({
      connectWith: ".connectedClientSortable"
    }).disableSelection();
	$( "#sortable3, #sortable4" ).sortable({
      placeholder: "ui-state-highlight"
    }).disableSelection();



 $( "#sortable2" ).sortable({
 	  	remove: function( event, ui ) {
  			current = $(ui.item);
  			var names = current.text().split(", ");
  			removedEmployee = Meteor.users.findOne( { $and: [{"profile.userGroup" : "Employee"}, {"profile.firstName" : names[1]}, {"profile.lastName" : names[0]} ] } );
  			projectEmployees.remove(removedEmployee._id);
  		},

		receive: function( event, ui ) {
  			current = $(ui.item);
  			var names = current.text().split(", ");
  			removedEmployee = Meteor.users.findOne( { $and: [{"profile.userGroup" : "Employee"}, {"profile.firstName" : names[1]}, {"profile.lastName" : names[0]} ] } );
  			sub = {
  				userID: removedEmployee._id,
  				projectID: projectID,
  				projectTitle: projectTitle,
  				projectRole: "Project Employee"
  			}
  			projectEmployees.insert(removedEmployee);
  			current.remove();
  			Meteor.call('subscription', sub, function (error, id) {
				if (error) {
            	} 
            	else {
            	}
        	});
  		},
	});


 $( "#sortable1" ).sortable({
  		remove: function( event, ui ) {
  			current = $(ui.item);
  			var names = current.text().split(", ");
  			removedEmployee = Meteor.users.findOne( { $and: [{"profile.userGroup" : "Employee"}, {"profile.firstName" : names[1]}, {"profile.lastName" : names[0]} ] } );
  			masterEmployees.remove(removedEmployee._id);
  			workingEmployees.remove(removedEmployee._id);
  		},

		receive: function( event, ui ) {
  			current = $(ui.item);
  			var names = current.text().split(", ");
  			removedEmployee = Meteor.users.findOne( { $and: [{"profile.userGroup" : "Employee"}, {"profile.firstName" : names[1]}, {"profile.lastName" : names[0]} ] } );
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

  			current.remove();
  			masterEmployees.insert(removedEmployee);
  			workingEmployees.insert(removedEmployee);
  			searchString = $("#search-field").val();
  			updateRemove(searchString);
  		},
	});

$( "#sortable4" ).sortable({
 	  	remove: function( event, ui ) {
  			current = $(ui.item);
  			var names = current.text().split(", ");
  			removedEmployee = Meteor.users.findOne( { $and: [{"profile.userGroup" : "Client"}, {"profile.firstName" : names[1]}, {"profile.lastName" : names[0]} ] } );
  			projectClients.remove(removedEmployee._id);
  		},

		receive: function( event, ui ) {
  			current = $(ui.item);
  			var names = current.text().split(", ");
  			removedEmployee = Meteor.users.findOne( { $and: [{"profile.userGroup" : "Client"}, {"profile.firstName" : names[1]}, {"profile.lastName" : names[0]} ] } );
  			sub = {
  				userID: removedEmployee._id,
  				projectID: projectID,
  				projectTitle: projectTitle,
  				projectRole: "Project Client"
  			}
  			projectClients.insert(removedEmployee);
  			current.remove();
  			Meteor.call('subscription', sub, function (error, id) {
				if (error) {
            	} 
            	else {
            	}
        	});
  		},
	});


 $( "#sortable3" ).sortable({
  		remove: function( event, ui ) {
  			current = $(ui.item);
  			var names = current.text().split(", ");
  			removedEmployee = Meteor.users.findOne( { $and: [{"profile.userGroup" : "Client"}, {"profile.firstName" : names[1]}, {"profile.lastName" : names[0]} ] } );
  			masterClients.remove(removedEmployee._id);
  			workingClients.remove(removedEmployee._id);
  		},

		receive: function( event, ui ) {
  			current = $(ui.item);
  			var names = current.text().split(", ");
  			removedEmployee = Meteor.users.findOne( { $and: [{"profile.userGroup" : "Client"}, {"profile.firstName" : names[1]}, {"profile.lastName" : names[0]} ] } );
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

  			current.remove();
  			masterClients.insert(removedEmployee);
  			workingClients.insert(removedEmployee);
  			searchString = $("#search-field").val();
  			updateRemove(searchString);
  		},
	});
}