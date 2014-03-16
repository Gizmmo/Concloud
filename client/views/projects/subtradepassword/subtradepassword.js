Template.subtradepassword.events({
	'click #enter-project': function () {
				var project = Projects.findOne({_id: this._id});
		Session.set('thisId', this._id);
		project.password = $('#project-password').val();
		Meteor.call('checkPassword', project, function(err, res){
			if(res){
			Router.go('projectPage', {"_id": Session.get('thisId')});
		}else{
			$('#incorrectPassword').removeClass('hidealert');
		}
	});
	},

	 'keypress #project-password': function (event) {
		//This will stop the default submitting of the form
		if(event.which === 13){
					var project = Projects.findOne({_id: this._id});
		Session.set('thisId', this._id);
		project.password = $('#project-password').val();
		Meteor.call('checkPassword', project, function(err, res){
			if(res){
			Router.go('projectPage', {"_id": Session.get('thisId')});
		}else{
			$('#incorrectPassword').removeClass('hidealert');
		}
	});
		}
	}
});