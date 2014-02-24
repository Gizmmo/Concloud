Template.deleteModal.events({
	'click #createSideProj' : function (event) {
		if($(event.target).attr('id')!=="delete-project"){
			clearBackground(event, "deleteProj");
		}
	},
	'keypress' : function(event) {
    if(event.which === 13){
	    deleteProject(event);
    }
  },

	'click #delete-project' : function (event) {
		deleteProject(event);
	}
});

function deleteProject(event){
	passedID = Session.get("projectId");
    Meteor.call('removeProject', passedID, function (error, result) {});
    clearBackground(event, "deleteProj")
    $("#deleteProj").modal("hide");
}