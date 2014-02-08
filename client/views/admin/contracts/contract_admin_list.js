onContractDelete = false;
onContractRoles = false;
clickedID = null;

Template.contractsAdminList.events({
	'keyup #search-field' : function () {
		updateView($("#search-field").val());
		
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
		$("#update-title").text(this.title);
		$("#update-description").text(this.description);
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
	}
});

Template.contractsAdminList.helpers({
	/**
	 * Finad all contracts and give them an integer rank for animation
	 * @return Collection Returns all contracts sorted by update time with an integer ranking
	 */
	contracts: function() {
		return Contracts.find({}, {sort : {"title" : 1}});
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
};

function updateView(searchValue) {
	if(searchValue == undefined || searchValue == null || searchValue == ""){
		contracts = Contracts.find({});
		contracts.forEach(function (contract) {
			$('#' + contract._id).show();
		});
	}else {
		contracts = Contracts.find({});
		contracts.forEach(function (contract) {
			searchStrings = searchValue.trim().split(" ");
			var found = true;
			for (var i = 0; i < searchStrings.length; i++) {
				if(contract.title.toLowerCase().indexOf(searchStrings[i].toLowerCase() ) === -1){
					found = false;
				}
			}

			if(found){
				$('#' + contract._id).show();
			}

			if(!found){
				$('#' + contract._id).hide();
			}

		});
	}
}

function deleteContract(passedID){
    Contracts.remove({_id: passedID});
}

