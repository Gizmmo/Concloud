Template.updateProjectModal.events({
	'click #updateData' : function (event) {
		clearBackground(event, "updateData");
	},
	'keypress' : function() {
    if(event.which === 13){
      clearBackground();
      updateProject();
    }
  },
	'click #update-project': function () {
		updateProject();
	}
});

function updateProject(){
	var title =$("#update-title").val();
	Projects.update({_id: clickedID}, {$set:{"title": title}});
}