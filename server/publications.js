Meteor.publish('notifications', function() {
  return Notifications.find({userID: this.userId});
});

Meteor.publish('subscriptions', function() {
  return Subscriptions.find();
});

Meteor.publish('projects', function(userGroup) {
	if(userGroup === "Admin" || userGroup === "Office Manager"){
		return Projects.find();
	}else if(userGroup === "Employee") {
		var subs = Subscriptions.find({userID: this.userId});
		var projIDs = new Array();
	
		subs.forEach(function (sub, index) {
			projIDs[index] = sub.projectID;
		});
	
	  return Projects.find({'_id' : { $in: projIDs}});
	} else if (userGroup === "Client"){
				var subs = Subscriptions.find({userID: this.userId});
		var projIDs = new Array();
	
		subs.forEach(function (sub, index) {
			projIDs[index] = sub.projectID;
		});
	  return Projects.find({'_id' : { $in: projIDs}});
	} else {
		//Sub Trades
	  return Projects.find();
	}
});

Meteor.publish('users', function(userGroup) {
	if(userGroup === "Admin" || userGroup === "Office Manager"){
  		return Meteor.users.find();
  	} else {
  		return Meteor.user();
  	}
});