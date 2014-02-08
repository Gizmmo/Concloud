
Template.contractAdminItem.events({
    'click .rightBtn' : function () {
    $(".b-contract-item").attr("data-target", "");
      Router.go('contractPage', {"_id": this._id});
  },

  'click .close-x' : function () {
    $(".b-contract-item").attr("data-target", "");
    workingContracts.remove({_id: this._id});
    Contracts.remove({_id: this._id});
  },

  'click' : function () {
  }
});

Template.contractAdminItem.helpers({

    getTitle: function () {
    if(this.title.length > 43){
      return this.title.substring(0, 40)+"...";
    }
    return this.title;
  },
	/**
	 * This function returns the id of the project
	 * @return String A string containing the id of the project
	 */
	contractId: function () {
		return this._id;
	},
	/**
	 * Returns the time in a readable format
	 * @return String A readable date string
	 */
	convertedTime: function () {
    if(this.recentUpdate){
		  return formatDate(this.recentUpdate.updateDate);
    } else {
      return formatDate(new Date().getTime());
    }
	},
  
  badgerData: function () {
    if(onContractDelete){
      return "badger-danger badger-left"
    }
    if(onContractRoles){
      return "badger-warning badger-right"
    }
    return "badger-info badger-left";
  },

  dataToggle : function () {
    if(onContractDelete){
      return ""
    }
    if(onContractRoles){
      return ""
    }
    return "#updateContract";
  }
});

Template.contractAdminItem.rendered = function(){
  // animate post from previous position to new position
  var instance = this;
  var rank = instance.data._rank;
  var $this = $(this.firstNode);
  var postHeight = 80;
  var newPosition = rank * postHeight;
  // if element has a currentPosition (i.e. it's not the first ever render)
  if (typeof(instance.currentPosition) !== 'undefined') {
    var previousPosition = instance.currentPosition;
    // calculate difference between old position and new position and send element there
    var delta = previousPosition - newPosition;
    $this.css("top", delta + "px");
  }else {
    // it's the first ever render, so hide element
    $this.addClass("invisible");
  }
  // let it draw in the old position, then..
  Meteor.defer(function() {
    instance.currentPosition = newPosition;
    // bring element back to its new original position
    $this.css("top",  "0px").removeClass("invisible");
  });
};
