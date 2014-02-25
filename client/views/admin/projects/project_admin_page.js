var sf = new SmartFile({});


Template.projectAdminPage.events({
	'keyup' : function () {
		updateClientView($("#search-client-field").val());
		updateEmployeeView($("#search-field").val());
		
	},
	'click .emp-click': function(event, ui) {
  		var id = ($(event)[0].target.id);
  		sub = {
  			userID: id,
  			projectID: projectID,
  			projectTitle: projectTitle,
  			projectRole: "Project Employee"
  		}
  		if($('#'+id).is(":checked")){
	  		Meteor.call('subscription', sub, function (error, id) {
				if (error) {
	           	} 
	           	else {
	           	}
	        });
  		} else {
  			Meteor.call('removeSubscription', sub, function (error, id) {
				if (error) {
            	} 
            	else {
            	}
        	});
        	updateEmployeeView($("#search-field").val());
  		}
	},
	'click .client-click': function(event, ui) {
  		var id = ($(event)[0].target.id);
  		sub = {
  			userID: id,
  			projectID: projectID,
  			projectTitle: projectTitle,
  			projectRole: "Project Client"
  		}
  		if($('#'+id).is(":checked")){
	  		Meteor.call('subscription', sub, function (error, id) {
				if (error) {
	           	} 
	           	else {
	           	}
	        });
  		} else {
  			Meteor.call('removeSubscription', sub, function (error, id) {
				if (error) {
            	} 
            	else {
            	}
        	});
        	updateEmployeeView($("#search-field").val());
  		}
	}
});

function updateEmployeeView(searchValue){
		if(searchValue == undefined || searchValue == null || searchValue == ""){
		users = Meteor.users.find({});
		users.forEach(function (user) {
			$('#emp-row-' + user._id).show();
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
				$('#emp-row-' + user._id).show();
			}

			if(!found){
				$('#emp-row-' + user._id).hide();
			}

		});
	}
}

function updateClientView(searchValue){
		if(searchValue == undefined || searchValue == null || searchValue == ""){
		users = Meteor.users.find({});
		users.forEach(function (user) {
			$('#client-row-' + user._id).show();
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
				$('#client-row-' + user._id).show();
			}

			if(!found){
				$('#client-row-' + user._id).hide();
			}

		});
	}
}


Template.projectAdminPage.helpers({
	employees : function () {
		projectID = this._id;
		projectTitle = this.title;
		return Meteor.users.find({$or: [{"profile.userGroup": "Employee"}, {"profile.userGroup": "Office Manager"} ] },{sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
	},

	projectEmployee : function () {
		var sub = Subscriptions.findOne({projectID: projectID, userID: this._id});
		if(sub){
			return true;
		}
		return false;
	},

	clients : function () {
		return Meteor.users.find({"profile.userGroup": "Client"},{sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
	},
	
	projectClient : function () {
		var sub = Subscriptions.findOne({projectID: projectID, userID: this._id});
		if(sub){
			return true;
		}
		return false;	}
});

Template.projectAdminPage.created = function () {
	projectID = this.data._id;
};