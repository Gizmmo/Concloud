Template.updateProjectModal.events({
	'click #updateData' : function (event) {
		if($(event.target).attr('id')!=="update-project"){
			clearBackground(event, "updateData");
		}
	},
	'keypress' : function(event) {
    if(event.which === 13){
      updateProject(event);
    }
  },
	'click #update-project': function (event) {
		updateProject(event);
	}
});

function updateProject(event){
	var title =$("#update-title").val();
	Projects.update({_id: clickedID}, {$set:{"title": title}});
	clearBackground(event, "updateData");
}