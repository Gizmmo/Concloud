var sf = new SmartFile({});
var searchFieldLength = 0;
var masterEmployees = new Meteor.Collection(null);
var workingEmployees = new Meteor.Collection(null);

employees = Meteor.users.find({"profile.userGroup" : "Employee"});
		
employees.forEach(function (employee){
	masterEmployees.insert(employee);
	workingEmployees.insert(employee);
});


Template.projectAdminPage.events({
	'keyup' : function () {
		searchString = $("#search-field").val();
		if(searchString.length > searchFieldLength){
			updateRemove(searchString);
		} else if (searchString.length < searchFieldLength){
			updateAdd(searchString);
		}
		searchFieldLength = searchString.length;
		employeeCount = ($("#sortable1 li").length);
		
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

Template.projectAdminPage.helpers({
	employees : function () {
		projectID = this._id;
		projectTitle = this.title;
		return workingEmployees.find({}, {sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
	}
});

Template.projectAdminPage.rendered = function() {
    $( "#sortable1, #sortable2, #sortable3" ).sortable({
      connectWith: ".connectedSortable"
    }).disableSelection();
	$( "#sortable1, #sortable2, #sortable3" ).sortable({
      placeholder: "ui-state-highlight"
    }).disableSelection();



 $( "#sortable3" ).sortable({
		receive: function( event, ui ) {
  			current = $(ui.item);
  			var names = current.text().split(", ");
  			removedEmployee = Meteor.users.findOne( { $and: [{"profile.userGroup" : "Employee"}, {"profile.firstName" : names[1]}, {"profile.lastName" : names[0]} ] } );
  			sub = {
  				userID: removedEmployee._id,
  				projectID: projectID,
  				projectTitle: projectTitle,
  				projectRole: "Employee"
  			}
  			Meteor.call('subscription', sub, function (error, id) {
				if (error) {
            	} 
            	else {
            	}
        	});
  		},
	});

 $( "#sortable2" ).sortable({
		receive: function( event, ui ) {
  			current = $(ui.item);
  			var names = current.text().split(", ");
  			removedEmployee = Meteor.users.findOne( { $and: [{"profile.userGroup" : "Employee"}, {"profile.firstName" : names[1]}, {"profile.lastName" : names[0]} ] } );
  			sub = {
  				userID: removedEmployee._id,
  				projectID: projectID,
  				projectTitle: projectTitle,
  				projectRole: "Project Leader"
  			}
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
}