onContractDelete = false;
onContractRoles = false;
searchConFieldLength = 0;
masterContracts = new Meteor.Collection(null);
workingContracts = new Meteor.Collection(null);

Template.contractsAdminList.events({
	'keyup' : function () {
		var searchConString = $("#search-proj-admin-field").val();
		
		if(searchConString.length != searchConFieldLength){
			updateConRemove(searchConString);
		} 
		searchConFieldLength = searchConString.length;
		
	},


	'click #create-contract' : function () {
		var curUser = Meteor.user();
		var name = Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName
		var contract = {
			title: $('#create-title').val(),
			description: $('#create-description').val()
		};

			//Calls the newly created Project's path after creating
		Meteor.call('contract', contract, function (error, id) {
			if (error) {
                // display the error to the user
                throwError(error.reason);
                // if the error is that the post already exists, take us there
                if (error.error === 302){
                }
            } else {
            	masterContracts.insert(contract);
            	workingContracts.insert(contract);
            }
        });
	},

	'click #delbtn' : function () {
		onContractDelete = !onContractDelete;
		onContractRoles = false;
		if(onContractDelete){
			$( ".b-contract-item" ).removeClass( "badger-info badger-warning" ).addClass( "badger-danger" );
			var boxes = $( ".b-contract-item" );
			//var xImage = $();
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "");
				$(boxes[i]).append('<i class="fa fa-times fa-2x close-x" id="close-x" title="Delete Contract" rel="tooltip"></i>');
				$('i').remove('.rightBtn');
				$("[rel=tooltip").tooltip();
			}
			//data-target="#updateData
		} else{
			$( ".b-contract-item" ).removeClass( "badger-danger" ).addClass( "badger-info" );
			var boxes = $( ".b-contract-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "#updateContract");
				$('i').remove('#close-x');
				$(boxes[i]).append('<i class="fa fa-arrow-circle-o-right rightBtn fa-2x" title="Go To Contract" rel="tooltip"></i>');
				$("[rel=tooltip").tooltip();
			}
		}
	},

	'click .b-contract-item': function () {
		$("#delete-title").text(this.title)
		$("#update-title").text(this.title);
		$("#delete-description").text(this.description);
		$("#update-description").text(this.description);
		$("#delete-submitted").text(this.authorName);
		$("#update-submitted").text(this.authorName);

		clickedID = this._id;
	},

	'click #upgradeBtn' : function () {
		onContractRoles = !onContractRoles;
		onContractDelete = false;
		if(onContractRoles){
			$( ".b-contract-item" ).removeClass( "badger-info badger-left badger-danger" ).addClass( "badger-warning badger-left" );
			var boxes = $( ".b-contract-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "");
				$('i').remove('.rightBtn');
				$('i').remove('#close-x');
				$("[rel=tooltip").tooltip();
			}
			//data-target="#updateData
		} else{
			$( ".b-contract-item" ).removeClass( "badger-warning badger-right" ).addClass( "badger-info badger-left" );
			var boxes = $( ".b-contract-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "#updateContract");
			    $(boxes[i]).append('<i class="link fa fa-arrow-circle-o-right rightBtn fa-2x" title="Go To Contract" rel="tooltip"></i>');
			    $('i').remove('#close-x');
			    $("[rel=tooltip").tooltip();

			}
		}
	},

	'click #update-contract': function () {
		var title =$("#update-title").val();
		var description = $("#update-description").val();
		Contracts.update({_id: clickedID}, {$set:{"title": title, "description": description}});
		masterContracts.update({_id: clickedID}, {$set:{"title": title, "description": description}});
		workingContracts.update({_id: clickedID}, {$set:{"title": title, "description": description}});
	},
});

Template.contractsAdminList.helpers({
	/**
	 * Finad all contracts and give them an integer rank for animation
	 * @return Collection Returns all contracts sorted by update time with an integer ranking
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

Template.contractsAdminList.rendered = function () {
	    if(onContractDelete){
	    	$( ".b-contract-item" ).removeClass( "badger-info badger-warning" ).addClass( "badger-danger" );
			var boxes = $( ".b-contract-item" );
       		for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "");
				$(boxes[i]).append('<i class="fa fa-times fa-2x close-x" id="close-x" title="Go To Contract" rel="tooltip"></i>');
				$('i').remove('.rightBtn');
			}
    } else if (onContractRoles){
       		$( ".b-contract-item" ).removeClass( "badger-info badger-left badger-danger" ).addClass( "badger-warning badger-left" );
			var boxes = $( ".b-contract-item" );
			for(var i = 0; i < boxes.length; i++){
				$(boxes[i]).attr("data-target", "");
			}
    }else{
	}
};

Template.contractsAdminList.created = function () {
	onContractDelete = false;
	onContractRoles = false;


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

function deleteContract(passedID){
	workingContracts.remove({_id: passedID});
    Contracts.remove({_id: passedID});
}

