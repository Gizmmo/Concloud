var sf = new SmartFile({});


Template.projectAdminPage.events({
	/**
 	 * This will mimic an actual update to the current project
	 * @param  Meteor.call('updateProject', this._id, function (error, result) {		});	}} [description]
	 * @return {[type]}   [description]
	 */
	'click #update-btn': function () {
		Meteor.call('updateProject', this._id, function (error, result) {
		});
	},

	'click #smartfile': function (e, template) {
		e.preventDefault();
		var file = template.find('#upload').files[0];
		sf.upload(file,

		function (err, res){
			if (err) {
		    	console.log("upload failed", err);
	        	return;
	    	}
	    	
		});
	},

	'click #downloadMe' : function(e, template){
		e.preventDefault();
		console.log('here');
		Meteor.call('downloadFile', "bench.jpg", window,
			function(err, result){
				if(err)
					console.log(err);
				window.location.href = result;
				
			});


	}
});

Template.projectAdminPage.helpers({
	
	listSmartFiles : function() {
		Meteor.call('getSmartFiles', function(err, response){
			console.log(response);
		});
	},

	employees : function () {
		return Meteor.users.find({}).fetch();
	}
});

Template.projectAdminPage.rendered = function() {
    $( "#sortable1, #sortable2, #sortable3" ).sortable({
      connectWith: ".connectedSortable"
    }).disableSelection();
	$( "#sortable1, #sortable2, #sortable3" ).sortable({
      placeholder: "ui-state-highlight"
    }).disableSelection();
}