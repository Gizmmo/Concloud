Template.updateProjectModal.events({
	'click #update-project': function () {
		var title =$("#update-title").val();
		Projects.update({_id: clickedID}, {$set:{"title": title}});
	}
});