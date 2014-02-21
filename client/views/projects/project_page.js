var sf = new SmartFile({});
var folderStack = [];

Template.projectPage.events({
	'click #update-btn': function () {
		Meteor.call('updateProject', this._id, function (error, result) {
		});
	},
	'click #selectAllItems' : function () {
		$('.projectCheckbox').prop('checked', true);
	},

	'click #file-upload' :function () {
		if(Session.get("uploadType") != "file"){
			Session.set("uploadType", "file");
			$('#file-li').addClass('active');
			$('#folder-li').removeClass('active');
		}
	},

	'click #folder-upload' : function () {
		if(Session.get('uploadType') != 'folder'){
			Session.set('uploadType', 'folder');
			$('#folder-li').addClass('active');
			$('#file-li').removeClass('active')
		}
	},

	'click #deleteItem' : function () {
		$('input:checkbox.projectCheckbox').each(function() {
			var thisVal = (this.checked ? $(this).attr('id') : "");

			if(thisVal != ""){
				var itemType = thisVal.split("-")[0];
				var itemName = thisVal.split("-")[1];
				if(itemType == 'folder'){
					deleteFolder(itemName);
				}else if (itemType == "file"){
					deleteFile(itemName);
				}
			}
		});

	},

     'click #uploadItem' : function(){
     	$("#uploadData").modal("toggle");
     },
 
 	'click #add-folder' : function(){
     	$("#addFolder").modal("toggle");
     },


     'click #downloadMe' : function(e, template){
     	e.preventDefault();
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
	    			constructProject();
	    			foundFolder = false;
	    		}else if(folderStack.length == 0){
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
			folderData.folders[folderTitle] = createFolder(folderTitle, folderTitle);
			Meteor.call('createDirectory', getDirectoryFromStack(projectData, false) + folderTitle, function (error, result) {
				if(error)
					console.log(error);
			});
			Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);
		}else{
			throwError("This folder already existed, please create a new folder name.");
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

			}else if (itemType == "file"){
				downloadFile(itemName);

			}
		}


	});

}
});

Template.projectPage.helpers({

	onFile : function() {
		return (Session.get("uploadType")==="file");
	},

	uploadingData : function() {
		return Session.get("uploadingData");
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
	Session.set("uploadType", "file");

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
};

getFolderStack = function() {
	return folderStack;
};

function deleteFolder(folderName){
	var projectData = Projects.findOne({_id: Session.get("currentProject")});
	var folderData = getFolderData(projectData);
	delete folderData.folders[folderName];
	Meteor.call("remove",getDirectoryFromStack(projectData, false) + folderName, function(err,result){
		if(err)
			console.log(err);
	});
	Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);

}

function deleteFile(fileName){
	var projectData = Projects.findOne({_id: Session.get("currentProject")});
	var folderData = getFolderData(projectData);
	var fileNameType = folderData.files[fileName].fileName + "." + folderData.files[fileName].fileType;
	delete folderData.files[fileName];
	Meteor.call("remove", getDirectoryFromStack(projectData, false) + fileNameType, function(err, result){
		if(err)
			console.log(err);
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
			window.location.href = result+"?download=true";
		}
	});
}






