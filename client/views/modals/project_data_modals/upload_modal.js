Template.uploadModal.events({
/**
     * Upload file to Smart file and to our database
     * @param  {[type]} e        event returned
     * @param  {[type]} template Parameter of the used template
     */
     'click #smartfile': function (e, template) {
     	e.preventDefault();
     	var file = template.find('#upload').files[0];
     	var projectData = Projects.findOne({_id: Session.get("currentProject")});
     	console.log("Directory " + getDirectoryFromStack(projectData, true));	 
     	if(folderStack.length > 0){
     		console.log(file);
     		console.log(getDirectoryFromStack(projectData, true));
     		console.log("Before Upload");
     		sf.upload(file, {
     			file: file.name,
     			path : getDirectoryFromStack(projectData, true)
     		},

     		function (err, res){
     			if (err) {
     				console.log("upload failed", err);
     				return;
     			}


     			var folderData = getFolderData(projectData);

			  //Find the document type by splitting on the .
			  var nameSplit = file.name.split(".");
			  var type = "";
			  var fileName = file.name;
			  if(nameSplit.length > 0){
			      //get type after .
			      type = nameSplit[1];
			      //Collect file name without .
			      fileName = nameSplit[0];
			  }
			  //Create File
			  folderData.files[fileName] = createFile(fileName, type);
			  console.log("Current Project Data");
			  console.log(projectData);
			  //Update Project
			  Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);



			});
     		console.log("Completed Uploding");
     	}else{
     		alert("You can only upload a file within a folder.");
     	}
     }
 });