Template.updateContractModal.events({
	'click #updateContract' : function (event) {
		clearBackground(event, "updateContract");
	},

	'keypress' : function() {
		if(event.which === 13){
			clearBackground();
			updateContract();
		}
	},

	'click #update-contract': function () {
		updateContract();
	}
});

function updateContract() {
	var title =$("#update-title").val();
	var description = $("#update-description").val();
	Contracts.update({_id: clickedID}, {$set:{"title": title, "description": description}});
}