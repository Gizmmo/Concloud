var currentItem;
	Template.hrItem.helpers({
	convertedTime: function () {
		if(this.profile.recent){
			if(this.profile.recent.lastLogin){
				return formatDate(this.profile.recent.lastLogin);
			}
		}
		return formatDate(new Date().getTime());
	},

	hrItem: function () {
		currentItem = HR.findOne({userId: this._id});
		return HRData.find({}, {sort: {fieldName: 1}});	
	},

	hrValue: function () {

		if(currentItem){
			if(currentItem.hrValues){
				for(var i = 0; i < currentItem.hrValues.length; i++){
					if (currentItem.hrValues[i].name === this.fieldName){
						return currentItem.hrValues[i].value;
					}
				}
			}
		}
	},

	initCurrent: function () {
		currentItem = null;
	},

	exitCurrent: function () {
		currentItem = null;
	}



});

Template.hrItem.events({
});