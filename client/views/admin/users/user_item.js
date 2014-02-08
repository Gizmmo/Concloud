Template.userItem.helpers({
  	getName: function () {
  		name = this.profile.lastName + ", " + this.profile.firstName;
	    if(name.length > 43){
	      return name.substring(0, 40)+"...";
	    }
	    return name;
	},

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
			return "";
		} else if(onUserHR){
			return "#hrData";
		}
		return "#updateData";
	},
	badgerData: function () {
		if(onUserDelete){
			return "badger-danger badger-left";
		} else if (onUserHR){
			return "badger-warning badger-left";
		}
		return "badger-info badger-left";
	},

	isUserInfo: function () {
		if(onUserHR){
			return false;
		}
		return true;
	},

	isHRInfo: function () {
		if(onUserHR){
			return true;
		}
		return false;
	}
});

Template.userItem.events({
 	'click .close-x' : function () {
	    $(".b-user-item").attr("data-target", "");
	    workingEmps.remove({_id: this._id});
	    Meteor.users.remove({_id: this._id});
  },
});