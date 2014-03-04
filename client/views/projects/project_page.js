var sf = new SmartFile({});
var folderStack = [];
var isSelectAll = false;

Template.projectPage.events({
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

'click .download-file-link' : function(event) {
	downloadFile($(event.target).html());
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

Template.projectPage.helpers({

	onFile : function() {
		return (Session.get("uploadType")==="file");
	},

	uploadingData : function() {
		return Session.get("uploadingData");
	},

	projectData : function() {
		var data = Folders.find({projectId: Session.get("currentProject"), parentId: Session.get('folderId')}, {sort: {name: 1}});
		console.log('hello');
		return data;

	},

	projectFiles : function() {
		return Files.find({projectId: Session.get("currentProject"), parentId: "none"},  {sort: {name: 1}});
	},
	officeManager: function () {
		if(user.profile.userGroup == "Admin" || user.profile.userGroup == "Office Manager"){
			return true;
		}
		return false;
	},
	allowedView: function () {
		if(isAccepted(this._id)){
			return true;
		}
		return false;
	},

	inFolder: function(){
		return Session.get('folderId')!=='none';
	}
});

function isAccepted(id){
	var user = Meteor.user();
	var folderData = Folders.findOne({_id: id});
	console.log(folderData)
	if(folderData.permissions.length > 0){
		if(isIn(folderData.permissions, user.profile.userGroup)){
			console.log(true);
			return true;
		}
		console.log('false');
		return false;
	}
	console.log('outside true');
	return true;
}

function isIn(checkArray, userGroup){
	for(var perm in checkArray){
		if (checkArray[perm] === userGroup){
			return true;
		}
	}
	return false;
}

Template.projectPage.created = function() {
	folderStack = [];
	Session.set("uploadType", "file");
	
};

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
			submitFolder($(document.getElementsByClassName('textPopover')[1]).val());
			$('#add-folder').popover('destroy');
			$('.popover').each(function(){
				$(this).remove();
			});
		}).on('hidden.bs.popover', function(){
			makePopover();
		});
	});
}

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

Template.projectPage.rendered = function() {
	$('#uploadItem').popover('destroy');
	Session.set('folderId', 'none');
	makePopover();
	makeFilePopover();
	confirmDelete();

	
};

Template.projectPage.destroyed = function() {
};

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
	var fileNameType = fileName.split(folderData.files[fileName].fileType)[0] + "." + folderData.files[fileName].fileType;
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

function submitFolder(folderTitle) {
	if(folderTitle != 'undefined'){

		var currentProject = Folders.findOne({projectId: Session.get('currentProject'), _id: Session.get('folderId')});
		var folder = {
			name: folderTitle,
			parentId: currentProject._id,
			parentName: currentProject.name,
			projectName: currentProject.projectName,
			projectId: currentProject.projectId,
		};
		Meteor.call('createFolder', folder, function(err,res){if(err){console.log(err);}});
		// 	Meteor.call('createDirectory', getDirectoryFromStack(projectData, false) + folderTitle, function (error, result) {
		// 		if(error){
		// 			console.log(error);
		// 		} else {
		// 			clearBackground(event, "addFolder");
		// 		}
		// 	});
		// 	Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);
		// }else{
		// 	throwError("This folder already existed, please create a new folder name.");
		// }
	}
}






