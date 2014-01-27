Template.project_folder.events({
    'click .filename-link' : function(event){
	console.log('clicked filename-link');
	//Find the folder within the folder stack
	enterFolder(event.target);
	
    }
});

Template.project_folder.helpers({
   date : function(event){
       return formatDate(this.proData.folderUpdate.updateDate);
   }
});






