Template.project_folder.events({
	'click .filename-link' : function(event){
	//Find the folder within the folder stack
	Router.go('inFolder', this);
},

'click .fileimage-link' : function(event){
	//Find the folder within the folder stack
	Router.go('inFolder', this);
}
});

Template.project_folder.helpers({
	getDate : function(event){
		var todaysDate = formatDate(this.updated);
		return todaysDate;
	}
});






