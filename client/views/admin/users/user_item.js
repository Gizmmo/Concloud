Template.userItem.helpers({
	convertedTime: function () {
		if(this.profile.recent){
			if(this.profile.recent.lastLogin){
				return formatDate(this.profile.recent.lastLogin);
			}
		}
		return formatDate(new Date().getTime());
	},
	dataToggle: function () {
		if(onUserDelete){
			return "#deleteData";
		}
		return "#updateData";
	},
	badgerData: function () {
		if(onUserDelete){
			return "badger-danger badger-left";
		}
		return "badger-info badger-left";
	}
});

Template.userItem.events({
 	'click .close-x' : function () {
	    $(".b-user-item").attr("data-target", "");
	    workingEmps.remove({_id: this._id});
	    Meteor.users.remove({_id: this._id});
  }
});

Template.userItem.rendered = function () {
	$("#hrbtn").click(function(){
	});
}