searchConFieldLength = 0;
var masterContracts = new Meteor.Collection(null);
var workingContracts = new Meteor.Collection(null);


Template.contractsList.helpers({
	/**
	 * Finad all projects and give them an integer rank for animation
	 * @return Collection Returns all projects sorted by update time with an integer ranking
	 */
	contracts: function() {
		masterContracts = new Meteor.Collection(null);
		var contracts = Contracts.find({});
	
		contracts.forEach(function (contract){
			contract.rank = 0;
			masterContracts.insert(contract);
		});

		return workingContracts.find({}, {sort : {"rank" : -1, "title" : 1}});
	}
});

Template.contractsList.events({
	'keyup' : function () {
		var searchConString = $("#search-contracts-field").val();
		
		if(searchConString.length != searchConFieldLength){
			updateConRemove(searchConString);
		}
		searchConFieldLength = searchConString.length;
		
	}
});

Template.contractsList.created = function () {

	masterContracts = new Meteor.Collection(null);
	workingContracts = new Meteor.Collection(null);

	searchConFieldLength = 0;
	contracts = Contracts.find({});
	
	contracts.forEach(function (contract){
		contract.rank = 0;
		workingContracts.insert(contract);
		masterContracts.insert(contract);
	});
};

function updateConRemove(searchString){
	searchString = searchString.toLowerCase();
	masterContracts.find({}).forEach(function (contract) {
		masterContracts.update({"_id": contract._id}, {$set: {"rank" : 0}});
		if(searchString.length > 0){
			searchStrings = searchString.trim().split(" ");
			var numInc = contract.rank;
			var found = false;
			for (var i = 0; i < searchStrings.length; i++) {
				if(!(workingContracts.findOne({"_id" : contract._id}))){
					if(contract.title.toLowerCase().indexOf(searchStrings[i]) != -1 || contract.description.toLowerCase().indexOf(searchStrings[i]) != -1){
						workingContracts.insert(contract);
					}
				}
				if(contract.title.toLowerCase().indexOf(searchStrings[i] ) != -1){
					found = true;
					numInc+=5;
					workingContracts.update({"_id": contract._id}, {$set: {"rank" : numInc}});
				}
				if(contract.description.toLowerCase().indexOf(searchStrings[i] ) != -1){
					found = true;
					numInc++;
					workingContracts.update({"_id": contract._id}, {$set: {"rank" : numInc}});
				}
			}

			if(!found){
				workingContracts.remove(contract._id)
			}else {
			}
		} else {
			masterContracts.find({}).forEach(function (contract) {
				if(!(workingContracts.findOne({"_id" : contract._id}))){
					workingContracts.insert(contract);
				}
			});
		}
	});
}
