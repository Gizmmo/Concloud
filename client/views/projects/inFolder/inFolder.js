var sf = new SmartFile({});
var folderStack = [];
var isSelectAll = false;

Template.inFolder.events({
	'click #update-btn': function () {
		Meteor.call('updateProject', this._id, function (error, result) {
		});
	},
	'click #selectAll' : function () {
		isSelectAll = !isSelectAll;
		$('.projectCheckbox').prop('checked', isSelectAll);
	},

	'click #file-upload' :function () {
		if(Session.get("uploadType") != "file"){
			Session.set("uploadType", "file");
		}
	},

	'click #folder-upload' : function () {
		if(Session.get('uploadType') != 'folder'){
			Session.set('uploadType', 'folder');
		}
	},

	'click #submitFolder' : function(e, template){
		smartFileFolder(e,template);
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

'click #header-base' : function(){
	Router.go('/project/'+ this.projectId);
},

'click .download-file-link' : function(event) {
	downloadFile($(event.target).attr('id'));
},

'click #downloadItems' : function() {
	// $('input:checkbox.projectCheckbox').each(function() {
	// 	var thisVal = (this.checked ? $(this).attr('id') : "");

	// 	if(thisVal !== ""){
	// 		var itemType = thisVal.split("-")[0];
	// 		var itemName = thisVal.split("-")[1];
	// 		if(itemType == 'folder'){

	// 		}else if (itemType == "file"){
	// 			downloadFile(itemName);

	// 		}
	// 	}


	// });
	// 
	Meteor.call('smartFileSize', function(err, result){
		if(err){
			console.log(err);
		}

		Session.set("smartFileSize", result);
	});

}
});

Template.inFolder.helpers({

	getPath: function() {
		var stack = getPathStack(this._id);
		return stack;
	},

	onFile : function() {
		return (Session.get("uploadType")==="file");
	},

	uploadingData : function() {
		return Session.get("uploadingData");
	},

	projectData : function() {
		var data = Folders.find({projectId: Session.get("currentProject"), parentId: this._id});
		Session.set('thisId', this._id);
		return data;

	},

	projectFiles : function() {
		console.log("Get Project Files");
		console.log(Files.find({projectId: Session.get("currentProject"), parentId: this._id}));
		return Files.find({projectId: Session.get("currentProject"), parentId: this._id});
	},
	officeManager: function () {
		if(user.profile.userGroup == "Admin" || user.profile.userGroup == "Office Manager"){
			return true;
		}
		return false;
	},
	allowedView: function () {
		// if(isAccepted(this.proData.folderName)){
		// 	return true;
		// }
		// return false;
		return true;
	},

	inFolder: function(){
		return Session.get('folderId')!=='none';
	}
});

// function isAccepted(folderName){
// 	var user = Meteor.user();
// 	var folderData = Folders.findOne({name: folderName});
// 	if(isIn(folderData.permissions, user.profile.userGroup)){
// 		return true;
// 	}
// 	return false;
// }

function isIn(checkArray, userGroup){
	for(var perm in checkArray){
		if (checkArray[perm] === userGroup){
			return true;
		}
	}
	return false;
}

function makePopover(){
	$('#add-folder').popover({
		html: true,
		title: function () {
			return $('.head').html();
		},
		content: function () {
			return $('.content').html();
		}
	}).on('shown.bs.popover', function(){
		$($('.addFolderPopover')[1]).find('#submit-FolderName').on('click', function(){
			console.log("in popover");
			var temp = $(document.getElementsByClassName('textPopover')[1]).val();
			$('.popover').each(function(){
				$(this).remove();
			});
			submitFolder(temp);
			$('#add-folder').popover('destroy');
		}).on('hidden.bs.popover', function(){
			makePopover();
		});
	});
}

getPathStack = function(id){
	var stack = [];
	var myFolder = Folders.findOne({_id: id});
	if(typeof myFolder !== 'undefined'){
		stack.unshift({name: myFolder.name, folderId: id});
		while(myFolder.parentId !== "none"){
			myFolder = Folders.findOne({_id: myFolder.parentId});
			stack.unshift({name: myFolder.name, folderId: myFolder._id});
		}
	}
	return stack;
};

function makeFilePopover(){
	$('#uploadItem').popover({
		html: true,
		title: function () {
			return $('#uploadhead').html();
		},
		content: function () {
			return $('#uploadcontent').html();
		}
	}).on('shown.bs.popover', function(){
		$($('.uploadData')[1]).find('#submitFile').on('click', function(){
			var files = document.getElementsByClassName('inFile')[1].files;
			$('.popover').each(function(){
				$(this).remove();
			});
			smartFileFile(files, new Date().getTime());
			
		});

		$($('.uploadData')[1]).find('#submitFolder').on('click', function(){
			var files = document.getElementsByClassName('inFolder')[1].files;
			$('.popover').each(function(){
				$(this).remove();
			});
			$('#uploadItem').popover('destroy');

			smartFileFolder(files, new Date().getTime());
		});
	}).on('hidden.bs.popover', function(){
		makeFilePopover();
	});
}

function confirmDelete(){
	$('#deleteItem').popover({
		html: true,
		title: function () {
			return $('#deletehead').html();
		},
		content: function () {
			return $('#deletecontent').html();
		}
	}).on('shown.bs.popover', function(){
		$($('.deleteData')[1]).find('#confirmDelete').on('click', function(){
			deleteItems();
			$('.popover').each(function(){
				$(this).remove();
			});
			$('#deleteItem').popover('destroy');
		});
	}).on('hidden.bs.popover', function(){
		confirmDelete();
	});
}

function deleteItems(){
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
}

Template.inFolder.destroyed = function () {
	$('#deleteItem').popover('destroy');
	$('#uploadItem').popover('destroy');
	$('#add-folder').popover('destroy');


};

Template.inFolder.rendered = function() {
	$('#uploadItem').popover('destroy');
	Session.set('folderId', 'none');
	makePopover();
	makeFilePopover();
	confirmDelete();
	
};

getDirectoryFromStack = function(projectData, fillSpaces){

	if(typeof projectData === 'undefined'){
		projectData = Projects.findOne({_id: Session.get("currentProject")});
	}

	var folderStack = getPathStack(Session.get('thisId'));
	var directory = projectData.title + "/";
	for (var i = 0; i < folderStack.length; i++) {
		var hold = "";
		if(fillSpaces){
			hold = folderStack[i].name.replace(/\s/g, "%20");
		}else{
			hold = folderStack[i].name;
		}

		directory += hold + "/";

	}

	return directory;
};

function deleteFolder(folderId){
	console.log("delete folder");
	console.log(folderId);
	var projectData = Projects.findOne({_id: Session.get("currentProject")});
	var folder = Folders.findOne({_id: folderId});
	console.log(folder);
	Meteor.call("remove",getDirectoryFromStack(projectData, false) + folder.name, function(err,result){
		if(err)
			console.log(err);
	});
	Meteor.call("removeFolder", folder, function(err, res){
		if(err){
			console.log(err);
		}
	});

}

function deleteFile(fileId){
	var projectData = Projects.findOne({_id: Session.get("currentProject")});
	var file = Files.findOne({_id: fileId});
	if(typeof file !== 'undefined'){
		var fileNameType = file.name.split(file.type)[0] + "." + file.type;
		Meteor.call("remove", getDirectoryFromStack(projectData, false) + fileNameType, function(err, result){
			if(err)
				console.log(err);
		});
		Meteor.call("removeFile", file, function(err,res){
			if(err){
				console.log(err);
			}
		});
	}
}

function downloadFile(itemName){
	console.log("itemName");
	console.log(itemName);
	var projectData = Projects.findOne({_id: Session.get("currentProject")});
	var file = Files.findOne({_id: itemName, parentId: Session.get('thisId')});
	var parent = Folders.findOne({_id: Session.get('thisId')});

	var directory = getDirectoryFromStack(projectData, false) + file.name.split(file.type)[0] + "." + file.type;

	console.log(directory);
	Meteor.call('exchangeSmartFiles', directory, function (error, result) {
		if(error){
			console.log(error);
		}else{
			console.log("see exchange result");
			console.log(result);
			window.location.href = result+"?download=true";
		}
	});
}

createFolder = function(name, parent){
	var folder = {
		name: name,
		parentId: parent._id,
		parentName: parent.name,
		projectName: parent.projectName,
		projectId: parent.projectId,
	};
	return folder;
};

function submitFolder(folderTitle) {
	if(typeof folderTitle !== 'undefined'){
		var parentFolder = Folders.findOne({_id: Session.get('thisId')});
		var projectData = Projects.findOne({_id: parentFolder.projectId});
		var folder = createFolder(folderTitle, parentFolder);
		console.log(getDirectoryFromStack(projectData, false) + folderTitle);
		Meteor.call('createFolder', folder, function(err,res){if(err){console.log(err);}});
		Meteor.call('createDirectory', getDirectoryFromStack(projectData, false) + folderTitle, function (error, result) {
			if(error){
				console.log(error);
			}
		});
		// 	Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);
		// }else{
		// 	throwError("This folder already existed, please create a new folder name.");
		// }
	}
}






