Template.updateContractModal.events({
	'click #update-contract': function () {
		var title =$("#update-title").val();
		var description = $("#update-description").val();
		Contracts.update({_id: clickedID}, {$set:{"title": title, "description": description}});
	}
});