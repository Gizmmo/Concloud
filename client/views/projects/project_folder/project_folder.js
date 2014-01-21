Template.project_folder.events({
    'click .filename-link' : function(event){
	console.log($(event.target).attr('id'));
    }
});