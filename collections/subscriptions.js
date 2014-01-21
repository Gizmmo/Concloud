Subscriptions = new Meteor.Collection('subscriptions');

Meteor.methods({

/**
 * Creates a subscrition linking a user and project
 * @param  String proj The project to be subscribed to
 * @return String  The new subscription ID
 */
	subscription: function(sub){
		var user = Meteor.user();
		var subCheck = Subscriptions.findOne( { $and: [ { userID: sub.userID}, {projectID: sub.projectID } ] } );
		if(subCheck){
			Meteor.call('removeSubscription', sub, function (error, id) {
				if (error) {
            	} 
            	else {
            	}
        	});
		}
		//Inserts new project into collection
		var subID = Subscriptions.insert(sub);

		//returns the ID of the new project
		return subID;
	},

	/**
	 * Removes a subscription from the subscription table
	 * @param  String projID The ID of the projec to be removed from the subscription
	 * @return void
	 */
	removeSubscription: function(sub){
		var subCheck = Subscriptions.findOne( { $and: [ { userID: sub.userID}, {projectID: sub.projectID } ] } );
		Subscriptions.remove(subCheck._id);
	}
});