Template.projectItem.events({
});

Template.projectItem.helpers({
	/**
	 * This function returns the id of the project
	 * @return String A string containing the id of the project
	 */
	projectId: function () {
		return this._id;
	},
	/**
	 * Returns the time in a readable format
	 * @return String A readable date string
	 */
	convertedTime: function () {
		return formatDate(this.recentUpdate.updateDate);
	}
});

Template.projectItem.rendered = function(){
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
