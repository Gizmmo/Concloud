var clickedID = null;
Template.userList.helpers({
	/**
	 * Finds all projects
	 * @return collection All projects in collection
	 */
	users: function() {
		return Meteor.users.find({}).fetch();
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

Template.userList.events({
	/**
	 * This will mimic an actual update to the current project
	 * @param  Meteor.call('updateProject', this._id, function (error, result) {		});	}} [description]
	 * @return {[type]}   [description]
	 */
	'click .b-user-item': function () {
		$("#first-name").text(this.profile.firstName);
		$("#last-name").text(this.profile.lastName);
		$("div.controls select").val(this.profile.userGroup);
		$("#last-logged-label").text(formatDate(this.profile.recent.lastLogin));
		if(this.profile.recent.lastProjectName){
			$("#last-worked-label").text(this.profile.recent.lastProjectName);
		} else{
			$("#last-worked-label").text("None");
		}
		clickedID = this._id;
	},
	'click #update-user': function () {
		var firstName = $("#first-name").val();
		var lastName = $("#last-name").val();
		var userGroup = $("#user-group").val();
		Meteor.users.update({_id: clickedID}, {$set:{"profile.firstName": firstName, "profile.lastName": lastName, "profile.userGroup": userGroup}})
		//Meteor.users.findOne({"_id" : clickedID});
	}
});

