Contracts = new Meteor.Collection('contracts');

Meteor.methods({

/**
 * Creates a subscrition linking a user and project
 * @param  String proj The project to be subscribed to
 * @return String  The new subscription ID
 */
	contract: function(contract){
		var user = Meteor.user();
		var userName = Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName;
		var cont = _.extend(_.pick(contract, 'title', 'description'), {
			authorID: user._id,
			authorName: userName,
			submitted: new Date().getTime(),
			updates: [{
				updateDate: new Date().getTime(),
				updateAuthorName: userName,
				updateAuthorID: user._id
			}],
			recentUpdate: {
				updateDate: new Date().getTime(),
				updateAuthorName: userName,
				updateAuthorID: user._id
			}
		});
		//Inserts new project into collection
		var conID = Contracts.insert(cont);

		//returns the ID of the new project
		return conID;
	},

	/**
	 * Removes a subscription from the subscription table
	 * @param  String projID The ID of the projec to be removed from the subscription
	 * @return void
	 */
	removeContract: function(contract){
		Contracts.remove(contract._id);
	}
});