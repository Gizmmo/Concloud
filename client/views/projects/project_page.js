var sf = new SmartFile({});
var folderStack = [];

Template.projectPage.events({
    /**
     * This will mimic an actual update to the current project
     * @param  Meteor.call('updateProject', this._id, function (error, result) {		});	}} [description]
     * @return {[type]}   [description]
     */
    'click #update-btn': function () {
	Meteor.call('updateProject', this._id, function (error, result) {
	});
    },
    'click #selectAllItems' : function () {
	$('.projectCheckbox').prop('checked', true);
    },

    'click #deleteItem' : function () {
	$('input:checkbox.projectCheckbox').each(function() {
	    var thisVal = (this.checked ? $(this).attr('id') : "");

	    if(thisVal != ""){
	 	var itemType = thisVal.split("-")[0];
	 	var itemName = thisVal.split("-")[1];
	 	if(itemType == 'folder'){
	 	    console.log("in folder delete : " + itemName);
	 	    deleteFolder(itemName);
	 	}else if (itemType == "file"){
	 	    console.log("in here");
	 	    deleteFile(itemName);
	 	}
	    }
	});

    },

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
	}else{
	    alert("You can only upload a file within a folder.");
	}
    },

    'click #downloadMe' : function(e, template){
	e.preventDefault();
	console.log('here');
	Meteor.call('downloadFile', "bench.jpg", window,
	 	    function(err, result){
	 		if(err)
	 		    console.log(err);


	 	    });


    },
    'click .headerLink' : function(e, template) {
	//Find which folder in the breadcrumbs has been clicked
	var folderClicked = $(e.target).attr('id');
	folderClicked = folderClicked.split("-")[1];
	//Check if the folder stack is empty, thus being at base
	if(folderStack.length != 0){
	    //check if the clicked folder is last in the stack, thus being the currently viewed folder
	    if(folderClicked != folderStack[(folderStack.length - 1)]){
	       	folderStack.pop();
	       	var foundFolder = true;
	       	while(foundFolder){
	       	    if(folderClicked === folderStack[(folderStack.length - 1)]){
	       		console.log("foundProject");
	       		constructProject();
	       		foundFolder = false;
	       	    }else if(folderStack.length == 0){
	       		console.log("in base resolution");
	       		constructProject();
	       		foundFolder = false;
	       	    }else{
	       		folderStack.pop();
	       	    }
	       	}

	    }
	}

	
    },

    'click #submitNewFolder' : function(){
	var folderTitle = $('#addFolderName').val();
	if(folderTitle != 'undefined'){
	    var projectData = Projects.findOne({_id: Session.get("currentProject")});
	    var folderData = getFolderData(projectData);
	    if(!(folderTitle in folderData.folders)){
		console.log("Inside create folder");
		folderData.folders[folderTitle] = createFolder(folderTitle, folderTitle);
		Meteor.call('createDirectory', getDirectoryFromStack(projectData, false) + folderTitle, function (error, result) {
		    if(error)
			console.log(error);
		});
		Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);
	    }else{
		alert("This folder already existed, and make a nicer error!");
	    }
	}
    },

    'click .download-file-link' : function(event) {
	downloadFile($(event.target).html());
    },

    'click #downloadItems' : function() {
	$('input:checkbox.projectCheckbox').each(function() {
	    var thisVal = (this.checked ? $(this).attr('id') : "");

	    if(thisVal != ""){
		var itemType = thisVal.split("-")[0];
		var itemName = thisVal.split("-")[1];
		if(itemType == 'folder'){
		    console.log("in folder Download : " + itemName);

		}else if (itemType == "file"){
		    downloadFile(itemName);
		    
		}
	    }

	    
	});

    }
});

Template.projectPage.helpers({
    
    listSmartFiles : function() {
	Meteor.call('getSmartFiles', function(err, response){
	    console.log(response);
	});
    },

    projectData : function() {
	return Projects.findOne({_id : Session.get("currentProject")}).folders;
    },

    projectFiles : function() {
	return Projects.findOne({_id : Session.get("currentProject")}).files;
    }
});

Template.projectPage.created = function() {
    folderStack = []; 

};

Template.projectPage.rendered = function() {
    var stackSession = Session.get('folderStack');
    if(typeof stackSession != 'undefined'){
	folderStack = stackSession;
	constructProject();
    }
};

Template.projectPage.destroyed = function() {
    Session.set("folderStack", []);
};

addToFolderStack = function(name){
    folderStack.push(name);
    console.log(folderStack);
};

getDirectoryFromStack = function(projectData, fillSpaces){
    
    if(typeof projectData === 'undefined'){
	projectData = Projects.findOne({_id: Session.get("currentProject")});
    }

    var directory = projectData.title + "/";
    for (var i = 0; i < folderStack.length; i++) {
	var hold = "";
	if(fillSpaces){
	    hold = folderStack[i].replace(/\s/g, "%20");
	}else{
	    hold = folderStack[i];
	}
	
	directory += hold + "/"

    };

    return directory;
}

topOfFolderStack = function(){
    return folderStack(folderStack.length).folderName;
};

removeFromFolderStack = function(){
    folderStack.pop();
    console.log(folderStack);
};

getFolderStack = function() {
    return folderStack;
};

function deleteFolder(folderName){
    var projectData = Projects.findOne({_id: Session.get("currentProject")});	
    var folderData = getFolderData(projectData);
    delete folderData.folders[folderName];
    console.log("folder data before update : " + projectData.folders);
    Meteor.call("remove",getDirectoryFromStack(projectData, false) + folderName, function(err,result){
	if(error)
	    console.log(error);
    });
    Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);

}

function deleteFile(fileName){
    console.log("Delete File " + fileName);
    var projectData = Projects.findOne({_id: Session.get("currentProject")});
    var folderData = getFolderData(projectData);
    var fileNameType = folderData.files[fileName].fileName + "." + folderData.files[fileName].fileType;
    delete folderData.files[fileName];
    console.log(projectData);
    console.log("remove file " + getDirectoryFromStack(projectData, false));
    Meteor.call("remove", getDirectoryFromStack(projectData, false) + fileNameType, function(err, result){
	if(error)
	    console.log(error);
    });
    Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);
}   

function downloadFile(itemName){
    var projectData = Projects.findOne({_id: Session.get("currentProject")});
    var folderData = getFolderData(projectData);
    var fileType = folderData.files[itemName].fileType;

    var directory = getDirectoryFromStack(projectData, false) + itemName + "." + fileType;

    Meteor.call('exchangeSmartFiles', directory, function (error, result) {
	if(error){
	    console.log(error);
	}else{
	    window.location.href = result;
	}
    });
}






