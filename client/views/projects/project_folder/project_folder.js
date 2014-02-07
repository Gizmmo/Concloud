Template.project_folder.events({
	'click .filename-link' : function(event){
		console.log('clicked filename-link');
	//Find the folder within the folder stack
	enterFolder(event.target);
	
}
});

Template.project_folder.helpers({
	getDate : function(event){
		var todaysDate = formatDate(this.proData.folderUpdate.updateDate);
		console.log(todaysDate);
		return todaysDate;
	}
});






