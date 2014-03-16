Template.addrootfolder.events({
	'click #create-folder': function () {

		if($('#rootfoldername').val() === "" || $('#rootfoldername').val() === "."){
			alert("Please insert a Folder Name");
		}else if(typeof Folders.findOne({name:$('#rootfoldername').val(), projectId: Session.get("currentProject")}) !== 'undefined'){
			alert("You are using a folder name that is already in use, please try another one.");
		}else{

			var project = Projects.findOne({_id: Session.get("currentProject")});
			var permissions = [];

			if($('#manager-checkbox').prop('checked')){
				permissions.push('Office Manager');
			}

			if($('#employee-checkbox').prop('checked')){
				permissions.push('Employee');
			}

			if($('#client-checkbox').prop('checked')){
				permissions.push('Client');
			}

			if($('#subtrades-checkbox').prop('checked')){
				permissions.push('Sub-Trade');
			}

			var folder = {
				name: $('#rootfoldername').val(),
				parentId: 'none',
				parentName: 'none',
				projectName: project.title,
				projectId: project._id,
				permissions: permissions

			};

			console.log(folder);

			Meteor.call('createFolder', folder, function(err,res){
				if(err)
					console.log(err);
				else{
				Meteor.call('createDirectory', project.title + "/" + folder.name, function (error, result) {
					if(error){
						console.log(error);
					}
				});
			}
			});

			Router.go("projectPage", {"_id": project._id});
		}
	}
});