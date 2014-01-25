Template.crumb.helpers({
	indPage: function () {
		if(!isLast(this)){
			if(isIndPage(this)){
				return true;
			} else {
				return false;
			}
		}
		return false;
	},
	openPage: function () {
		if(!isLast(this)){
			if(isIndPage(this)){
				return false;
			} else {
				return true;
			}
		}
		return false;	
	},

	lastLink: function () {
		if(isLast(this)){
			return true;
		}
	}
});

Template.crumb.events({
	'click #indPage': function () {
		Router.go('projectPage', {"_id": this.pageId});
	}
});

function isLast(nodeCheck){
	if(breadtrail[breadtrail.length-1] == nodeCheck){
		return true;
	}
	return false;
}

function isIndPage(nodeCheck){
			if(this.pageId === null || this.pageId === undefined){
				return false;
			}
				return true;
}