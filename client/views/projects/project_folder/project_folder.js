Template.project_folder.events({
    'click .filename-link' : function(event){
	console.log('clicked filename-link');
	//Find the folder within the folder stack
	enterFolder(event.target);
	
    }
});






