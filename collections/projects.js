Projects = new Meteor.Collection('projects');

Meteor.methods({
	/**
	 * This function will data validate the new project being passed
	 * and then if no errors occur, place this new project in
	 * the Project collection
	 * @param  {[object]} projectAttributes [A prelimeanry project object, containg the title, description, and url]
	 * @return {[string]}                   [A String of its ID in the collection]
	 */
	project: function(projectAttributes){

		var user = Meteor.user();
		var userName = Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName;

		//Ensures that the user is logged in
		if (!user){
			throw new Meteor.Error(401, "You need to log in to create new projects");
		}

		if(!projectAttributes.title){
			throw new Meteor.Error(422, 'Error 422: Project must have a title');
		}

		if(Projects.findOne({"title" : projectAttributes.title})) {
			throw new Meteor.Error(423, 'Must have a unique name');
		}

		//filling in other keys
		var proj = _.extend(_.pick(projectAttributes, 'title', 'password'), {
			authorID: user._id,
			authorName: userName,
			submitted: new Date().getTime(),
			updates: [{
				updateDate: new Date().getTime(),
				updateAuthorName: userName,
				updateAuthorID: user._id
			}],
			recentUpdate: {
				updateDate: new Date().getTime(),
				updateAuthorName: userName,
				updateAuthorID: user._id
			}
			
		});

		//Inserts new project into collection
		var projectID = Projects.insert(proj);
		//returns the ID of the new project
		return projectID;
	},

	/**
	 * This function will update the project passed to
	 * have a new update Author and update Time
	 * @param  String id The id of the project to be updated
	 * @return void    Returns nothing
	 */
	updateProject: function(project, folders){
		var user = Meteor.user();
		var id = project._id;
		var userName = Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName;

		Meteor.users.update({_id: Meteor.userId()}, {$set : {'profile.recent.lastProjectID' : id, 'profile.recent.lastProjectName' : project.title } });
		var update = {
				updateDate: new Date().getTime(),
				updateAuthorName: userName,
				updateAuthorID: user._id
			};
		project.updates[project.updates.length] = update;
		project.recentUpdate = update;

		Projects.update(id, project);
		Meteor.call("createProjectNotification", project);
	}
,
	updateProjectVitals: function(project){
		var oldProject = Projects.findOne(project._id);
		Projects.update({_id: project._id}, project);
		if(oldProject.title !== project.title){
			folders = Folders.find();
			folders.forEach(function (folder) {
				if (folder.projectId === oldProject._id){
					folder.projectName = project.title;
					Meteor.call('updateFolder', folder, function (error, result) {});
				}
			});

			files = Files.find();
			files.forEach(function (file) {
				if (file.projectId === oldProject._id){
					file.projectName = project.title;
					Meteor.call('updateFile', file, function (error, result) {});
				}
			});
		}

	},
	checkPassword: function (data) {
		var project = Projects.findOne({_id: data._id});
		if(project.password === data.password){
			return true;
		}
		return false;
	},

	removeProject: function(id){
		Projects.remove(id);
	}
});