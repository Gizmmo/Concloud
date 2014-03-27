var isEdit;
var editData;
Template.userList.events({
	'keyup #search-field' : function () {
		updateView($("#search-field").val());
		
	},

	'click #selectAll': function () {
		myArray = $('.tableBox');
		if ($('#selectAll').is(':checked')){
			for(var i = 0; i < myArray.length; i++){
				$(myArray[i]).prop('checked', true);
			}
		} else {
			for(var i = 0; i < myArray.length; i++){
				$(myArray[i]).prop('checked', false);
			}
		}
	},

	'click .editProject' : function(event, template) {
		if(!isEdit){
			event.preventDefault();
			isEdit = true;
			var split = event.target.id.split("-");
			var button = $("#editbutton-" + split[1]);
			var confirmbutton = $("#confirmbutton-" + split[1]);
			var deleteButton = $("#deletebutton-" + split[1]);

			Session.set("inEditItem", split[1]);

			deleteButton.find('i').attr('class', 'fa fa-ban bigger-120');
			deleteButton.addClass("cancelProject");

			button.attr("disabled",true);
			confirmbutton.attr("disabled", false);

			var row = $('#row-' + split[1]);
			var dataRows = row.find("td");

			var user = Meteor.users.findOne({_id: split[1]});
			for (var i = 0; i < dataRows.length; i++) {
				if(i>0){
					var dataRow = $(dataRows[i]);
					if(dataRow.hasClass('String')){
						editData[i] = dataRow.html();
						dataRow.html("<input type='text' maxlength='40' id='txtName' value='"+dataRow.html()+"'/>");
					} else if(dataRow.hasClass('Password')){
						dataRow.html("<input type='password' maxlength='40' id='txtName' value=''/>");
					} else if (dataRow.hasClass("Selection")){
							var selectVal = dataRow.html();
							dataRow.html("<select name=''user-group' id ='user-create-group' class='groupSelect'><option value='Employee'>Employee</option><option value='Client''>Client</option><option value='Office Manager'>Office Manager</option><option value='Sub-Trade'>Sub-Trade</option></select>");
							var select = $(dataRow.find("select")).attr('id');
							$("#" + select +' option[value="' + selectVal +'"]').attr('selected', 'selected');
							editData[i] = selectVal;
					} else if(dataRow.hasClass("Boolean")){
						if(dataRow.find("i").hasClass("fa-check")){
							dataRow.html("<input type='checkbox' id='checkbox' checked = 'true' />");
							editData[i] = true;
						}else{
							dataRow.html("<input type='checkbox' id='checkbox' checked = 'false' />");
							editData[i] = false;
						}
					}
				}
			}
		}
	},

	'click .confirmProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");
		var button = $("#editbutton-" + split[1]);
		var confirmbutton = $("#confirmbutton-" + split[1]);
		var user = Meteor.users.findOne({_id: split[1]});
		var deleteButton = $("#deletebutton-" + split[1]);

		var row = $('#row-' + split[1]);
		var dataRows = row.find("td");

		if(validateRow(dataRows)){
			confirmbutton.attr("disabled",true);
			button.attr("disabled", false);
			for (var i = 0; i < dataRows.length; i++) {
				if(i>0){
					var dataRow = $(dataRows[i]);
					if(dataRow.hasClass('String')){
						dataRow.html(dataRow.find("input").val());
					}else if(dataRow.hasClass('Password')){
						var data = dataRow.find("input").val();
						var returnString = "";
						for(var t = 0; t < data.length; t++){
							returnString += '*';
						}
						dataRow.html(returnString);
					} else if (dataRow.hasClass("Selection")){
						dataRow.html(dataRow.find("select").val());
					}else if(dataRow.hasClass("Boolean")){
						if(dataRow.find("input").is(":checked")){
							dataRow.html("<i class=\"fa fa-check\"></i>");
						}else{
							dataRow.html("<i class=\"fa fa-ban\"></i>");
						}
					}
				}
			}

			Session.set("inEditItem", null);
			var firstName = replaceAmp($(dataRows[2]).html());
			var lastName = replaceAmp($(dataRows[1]).html());
			var userGroup = replaceAmp($(dataRows[3]).html());
			Meteor.users.update({_id: split[1]}, {$set:{"profile.firstName": firstName, "profile.lastName": lastName, "profile.userGroup": userGroup}})
			deleteButton.removeClass("cancelProject");
			deleteButton.find('i').attr('class', 'fa fa-trash-o bigger-120');
			isEdit = false;
		}
	},

	'click #addRow' : function(){
		if(!Session.get("NewRow")){
			Session.set("NewRow", true);
			$('#tableData').find("tbody").prepend(Template['emptyUser']());
			var newRow = $($('#tableData').find("tbody").find('tr')[0]);
			var dataRows = newRow.find("td");

			for (var i = 0; i < dataRows.length; i++) {
				if(i>0){
					var dataRow = $(dataRows[i]);
					if(dataRow.hasClass('String')){
						dataRow.html("<input type='text' id='txtName' maxlength='40' value=''/>");
					}else if (dataRow.hasClass('Password')){
						dataRow.html("<input type='password' id='txtName' maxlength='40' value=''/>");
					}else if(dataRow.hasClass('Email')){
					dataRow.html("<input type='text' id='email' maxlength='40' value=''/>");
					}else if(dataRow.hasClass("Boolean")){
						dataRow.html("<input type='checkbox' id='checkbox' checked = 'true' />");
					}else if (dataRow.hasClass("Selection")){
						dataRow.html("<select name='user-group' id ='user-create-group' class='groupSelect'><option value='Employee'>Employee</option><option value='Client'>Client</option><option value='Office Manager'>Office Manager</option><option value='Sub-Trade'>Sub-Trade</option></select>");;
					}else {
						if(dataRows.length -1 !== i){
							dataRow.html("");
						}
					}
				}
			}

			var editProject = $(dataRows[dataRows.length-1]).find("button.editProject");
			var completeProject = $(dataRows[dataRows.length-1]).find("button.confirmProject");
			var deleteProject = $(dataRows[dataRows.length-1]).find("button.deleteProject");
			// var manageProject = $(dataRows[dataRows.length-1]).find("button.manageProject");
			$(dataRows[dataRows.length-1]).find("a.goToProject").remove();

			editProject.attr("disabled",true);
			completeProject.attr("disabled", false);
			// manageProject.attr("disabled", true);

			completeProject.removeClass("confirmProject");
			completeProject.attr('id', "CompleteRow");
			deleteProject.removeClass("deleteProject");
			deleteProject.attr("id", "deleteRow");

			$("#tableData").prepend(newRow);
			$(newRow.find('td')[1]).find('input').focus();
		}else{
			var completedRow = $($('#tableData').find("tbody").find("tr")[0]);
			//INSERT DATA HERE

			var dataRows = completedRow.find("td");
			if(validateRow(dataRows)){
		        var time = new Date().getTime();
		        var options = {
		            email : $(dataRows[4]).find('input').val(),
		            password : 'password',
		                //Profile is the object within the user that can
		                //be freely edited by the user
		                profile : {
		                    firstName : replaceAmp($(dataRows[2]).find('input').val()),
		                    lastName: replaceAmp($(dataRows[1]).find('input').val()),
		                    email: replaceAmp($(dataRows[4]).find('input').val()),
		                    userGroup : replaceAmp($(dataRows[3]).find('select').val()),
		                    joinDate: time,
		                    recent: {
		                        lastLogin: time,
		                        lastProjectName: "None",
		                        lastProjectID: "None"
		                    }
		                }
		            }
		        $(completedRow).remove();
		        Meteor.call('createNewUser', options, function (error, id) {
		            if(error){

		            }else {
		                Meteor.call("HREntry", {userId: id}, function (error, id){});
		            }
		        });
		        $("#search-field").val("");

				Session.set("NewRow", false);
			}
		}

	},

	'click #CompleteRow' : function() {
		var completedRow = $($('#tableData').find("tbody").find("tr")[0]);
		//INSERT DATA HERE

		var dataRows = completedRow.find("td");
		if(validateRow(dataRows)){
	        var time = new Date().getTime();
	        var options = {
	            email : $(dataRows[4]).find('input').val(),
	            password : 'password',
	                //Profile is the object within the user that can
	                //be freely edited by the user
	                profile : {
	                    firstName : replaceAmp($(dataRows[2]).find('input').val()),
	                    lastName: replaceAmp($(dataRows[1]).find('input').val()),
	                    email: replaceAmp($(dataRows[4]).find('input').val()),
	                    userGroup : replaceAmp($(dataRows[3]).find('select').val()),
	                    joinDate: time,
	                    recent: {
	                        lastLogin: time,
	                        lastProjectName: "None",
	                        lastProjectID: "None"
	                    }
	                }
	            }
	        $(completedRow).remove();
	        Meteor.call('createNewUser', options, function (error, id) {
	            if(error){

	            }else {
	                Meteor.call("HREntry", {userId: id}, function (error, id){});
	            }
	        });
	        $("#search-field").val("");

			Session.set("NewRow", false);
		}

	},

	'click #deleteRow' : function() {
		var newRow = $($('#tableData').find("tbody").find("tr")[0]).remove();
		Session.set("NewRow", false);
	},

	'click .manageProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");

		var projectID = split[1];
		//Router.go('projectAdminPage', {"_id": split[1]});
		

	},

	'click .deleteProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");
		var deleteButton = $("#deletebutton-" + split[1]);
		if($(deleteButton).hasClass("cancelProject")){
			deleteButton.find('i').attr('class', 'fa fa-trash-o bigger-120');
			deleteButton.removeClass('cancelProject');
			var button = $("#editbutton-" + split[1]);
			var confirmbutton = $("#confirmbutton-" + split[1]);
			var row = $('#row-' + split[1]);
			var dataRows = row.find("td");

			confirmbutton.attr("disabled",true);
			button.attr("disabled", false);
			for (var i = 0; i < dataRows.length; i++) {
				if(i>0){
					var dataRow = $(dataRows[i]);
					if(dataRow.hasClass('String')){
						dataRow.html(editData[i]);
					}else if(dataRow.hasClass('Password')){
						var data = $(editData[i]).find("input").val();
						var returnString = "";
						for(var t = 0; t < data.length; t++){
							returnString += '*';
						}
						dataRow.html(returnString);
					} else if (dataRow.hasClass("Selection")){
						dataRow.html(editData[i]);
					}else if(dataRow.hasClass("Boolean")){
						if(editData[i]){
							dataRow.html("<i class=\"fa fa-check\"></i>");
						}else{
							dataRow.html("<i class=\"fa fa-ban\"></i>");
						}
					}
				}
			}

			Session.set("inEditItem", null);
			isEdit = false;
		} else {
			targetParent = $(event.target)[0].parentNode;
			while(!$(targetParent).hasClass('btn-group')){
				targetParent = targetParent.parentNode;
			}
			if($(targetParent).find('.confirmDelete').length ==0){
				$(targetParent).append(Template['confirmDeleteButton']({_id: this._id}));
				var foundButton = $(targetParent).find('.confirmDelete');
				var height = $("#confirmbutton-"+split[1]).css('height');
				$(foundButton).toggle('show');
			} else {
				var foundButton = $(targetParent).find('.confirmDelete');
				$(foundButton).toggle('show', function() {
					$(foundButton).remove();
				});
				
			}
		}

	},

	'click .confirmDelete' : function () {
		var split = event.target.id.split("-");
		var row = $('#row-' + split[1]);
		// row.remove();
		var projectID = split[1];
		removeUser(projectID);
	}
});

Template.userList.helpers({
	users: function() {
	 	return Meteor.users.find({"profile.userGroup": {$ne: "Admin"}}, {sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
	 },

	convertedTime: function () {
	 	if(this.profile.recent){
	 		if(this.profile.recent.lastLogin){
	 			return formatDate(this.profile.recent.lastLogin);
	 		}
	 	}
	 	return formatDate(new Date().getTime());
	 }
});

Template.userList.rendered = function () {
	confirmDelete();
	if(Session.get("inEditItem")){
		var deleteButton = $("#deletebutton-" + Session.get("inEditItem"));
		if(!deleteButton.hasClass("cancelProject")){
			Session.set("inEditItem", null);
			isEdit = false;
		}
	}
};

function confirmDelete(){
	$('#removeSelected').popover({
		html: true,
		title: function () {
			return $('#deletehead').html();
		},
		content: function () {
			return $('#deletecontent').html();
		}
	}).on('shown.bs.popover', function(){
		$($('.deleteData')[1]).find('#confirmDelete').on('click', function(){
			removeSelected();
			$('.popover').each(function(){
				$(this).remove();
			});
		});
	}).on('hidden.bs.popover', function(){
		confirmDelete();
	});
}

function removeSelected(){
	myArray = $('.tableBox');
		if(Session.get("NewRow")){
			if($("#newRow").length>0){
				$($('#tableData').find("tbody").find("tr")[0]).remove();
			}
			Session.set("NewRow", false);
		} else {
			for(var i = 0; i < myArray.length; i++){
				if($(myArray[i]).is(':checked')){
					var split = $(myArray[i]).context.id.split("-");
					var projectID = split[1];
					removeUser(projectID);
				}
			}
		}
}

function updateView(searchValue){
		if(searchValue == undefined || searchValue == null || searchValue == ""){
		users = Meteor.users.find({});
		users.forEach(function (user) {
			$('#' + "row-" + user._id).show();
		});
	}else {
		users = Meteor.users.find({});
		users.forEach(function (user) {
			searchStrings = searchValue.trim().split(" ");
			var found = true;
			for (var i = 0; i < searchStrings.length; i++) {
				if(user.profile.firstName.toLowerCase().indexOf(searchStrings[i].toLowerCase() ) === -1 && user.profile.lastName.toLowerCase().indexOf(searchStrings[i].toLowerCase() ) === -1){
					found = false;
				}
			}

			if(found){
				$('#' + "row-" + user._id).show();			
			}

			if(!found){
				$('#' + "row-" + user._id).hide();			
			}

		});
	}
}

function removeUser(id){
	var found = Meteor.users.findOne({_id: id});
	var canDelete = true;
	if(found.profile.userGroup === "Office Manager"){
		if(Meteor.users.find({'profile.userGroup': "Office Manager"}).count() < 2){
			canDelete = false;
		}
	}

	if(found._id === Meteor.user()._id){
		canDelete = false;
	}

	if(canDelete){
		Meteor.users.remove({_id: id}, function(error, result){
			Meteor.call("HRDelete", id);
		});
	}
}

function validateRow(dataRows){
	var returnValue = true;
	for (var i = 0; i < dataRows.length; i++) {
		if(i>0){
			var dataRow = $(dataRows[i]);
			dataRow.find('.valCheck').remove();
			if(dataRow.hasClass('String') || dataRow.hasClass('Password')){
				if($(dataRow).find('input').val().length < 1){
					dataRow.find('input').addClass("formError");
					returnValue = false;
				} else {
					dataRow.find('input').addClass("formCorrect");
				}
			}else if (dataRow.hasClass('Email')){
				emailValue = $(dataRow).find('input').val();
				emailFound = Meteor.users.findOne({"profile.email" : emailValue});
				if(emailValue.length < 1){
					dataRow.find('input').addClass("formError");
					returnValue = false;
				} else if(emailValue.indexOf('@') === -1 || emailValue.indexOf('.') === -1){
					dataRow.find('input').addClass("formError");
					returnValue = false;
				} else if (emailFound){
					dataRow.find('input').addClass("formError");
					returnValue = false;
				} else {
					dataRow.find('input').addClass("formCorrect");
				}
			}
		}
	}
	return returnValue;
}

function replaceAmp(originalName){
	if(originalName){
		while (originalName.indexOf('&amp') > -1){
			var n = originalName.indexOf('&amp');
			originalName = originalName.substring(0,n) + "&" + originalName.substring((n+5),originalName.length);
		}
	}
	return originalName;
}

Template.userList.created = function () {
	$("#search-field").val("");
	Session.set("NewRow", false);
	isEdit = false;
	editData = [];
	Session.set("inEditItem", null);
};