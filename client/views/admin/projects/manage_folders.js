var originalName = null;
Template.manageFolders.events({
	'keyup #search-field' : function () {
		updateView($("#search-field").val());
		
	},

	'click .editProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");
		var button = $("#editbutton-" + split[1]);
		var confirmbutton = $("#confirmbutton-" + split[1]);

		button.attr("disabled",true);
		confirmbutton.attr("disabled", false);

		var row = $('#row-' + split[1]);
		var dataRows = row.find("td");

		var project = Projects.findOne({_id: split[1]});
		for (var i = 0; i < dataRows.length; i++) {
			if(i>0){
				var dataRow = $(dataRows[i]);
				if(dataRow.hasClass('String')){
					if(dataRow.hasClass('Unique')){
						originalName = dataRow.html();
					}
					dataRow.html("<input type='text' id='txtName' value='"+dataRow.html()+"'/>");
				} else if(dataRow.hasClass('Password')){
					dataRow.html("<input type='password' id='txtName' value='"+project.password+"'/>");
				} else if(dataRow.hasClass("Boolean")){
					if(dataRow.find("i").hasClass("fa-check")){
						dataRow.html("<input type='checkbox' id='checkbox' checked = 'true' />");
					}else{
						dataRow.html("<input type='checkbox' id='checkbox' />");
					}
				}
			}
		}
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

	'click .confirmProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");
		var button = $("#editbutton-" + split[1]);
		var confirmbutton = $("#confirmbutton-" + split[1]);
		var folder = DefaultFolders.findOne({_id: split[1]});
		var eachHeader = $($('#tableData').find("thead").find("tr")[0]).find("th");

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
					}else if(dataRow.hasClass("Boolean")){
						if(dataRow.find("input").is(":checked")){
							dataRow.html("<i class=\"fa fa-check\"></i>");
						}else{
							dataRow.html("<i class=\"fa fa-ban\"></i>");
						}
					}
				}
			}

			folder.name = $(dataRows[1]).html();
			var permissions = [];

			for(var i = 2; i < 6; i++){
				if($(dataRows[i]).find("i").hasClass("fa-check")){
					permissions[permissions.length] = $(eachHeader[i]).html();
				}
			}

			folder.permissions = permissions;

			Meteor.call('updateFolder', folder, function (error, id) {
				if (error) {
		       	} 
		       	else {
		       	}
		    });
		}
	},

	'click #addRow' : function(){
		if(!Session.get("NewRow")){
			Session.set("NewRow", true);
			$('#tableData').find("tbody").prepend(Template['emptyFolder']());
			var newRow = $($('#tableData').find("tbody").find('tr')[0]);
			var dataRows = newRow.find("td");

			for (var i = 0; i < dataRows.length; i++) {
				if(i>0){
					var dataRow = $(dataRows[i]);
					if(dataRow.hasClass('String')){
						dataRow.html("<input type='text' id='txtName' value=''/>");
					}else if (dataRow.hasClass('Password')){
						dataRow.html("<input type='password' id='txtName' value=''/>");
					}else if(dataRow.hasClass("Boolean")){
						dataRow.html("<input type='checkbox' id='checkbox'/>");
					} else {
						if(dataRows.length -1 !== i){
							dataRow.html("");
						}
					}
				}
			}

			var editProject = $(dataRows[dataRows.length-1]).find("button.editProject");
			var completeProject = $(dataRows[dataRows.length-1]).find("button.confirmProject");
			var deleteProject = $(dataRows[dataRows.length-1]).find("button.deleteProject");
			$(dataRows[dataRows.length-1]).find("a.goToProject").remove();

			editProject.attr("disabled",true);
			completeProject.attr("disabled", false);

			completeProject.removeClass("confirmProject");
			completeProject.attr('id', "CompleteRow");
			deleteProject.removeClass("deleteProject");
			deleteProject.attr("id", "deleteRow");

			$("#tableData").prepend(newRow);
			$(newRow.find('td')[1]).find('input').focus();
		}else{
			alert("Already have a new Row, complete it before continuing.");
		}

	},

	// 'keypress input' : function (event) {
	// 	var keyTarget = event.target
	// 	if(keyTarget.id !== "search-field"){
	// 		if(event.charCode===13){
	// 			if(Session.get("NewRow")){
	// 				$("#completedRow").click();
	// 			}
	// 		}
	// 	}
	// },

	'click #CompleteRow' : function() {
		var completedRow = $($('#tableData').find("tbody").find("tr")[0]);
		var eachHeader = $($('#tableData').find("thead").find("tr")[0]).find("th");

		var dataRows = completedRow.find("td");

		if(validateRow(dataRows)){
			var folder = {};
			folder.name = $(dataRows[1]).find("input").val();
			var permissions = [];

			for(var i = 2; i < 6; i++){
				if($(dataRows[i]).find("input").is(":checked")){
					permissions[permissions.length] = $(eachHeader[i]).html();
				}
			}
			$(completedRow).remove();

			folder.permissions = permissions;

			Meteor.call('addFolder', folder, function (error, id) {
				if (error) {
		       	} 
		       	else {
		       	}
		    });


			Session.set("NewRow", false);
		}

	},

	'click #deleteRow' : function() {
		var newRow = $($('#tableData').find("tbody").find("tr")[0]).remove();
		Session.set("NewRow", false);
	},

	'click .deleteProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");
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

	},

	'click .confirmDelete' : function () {
		var split = event.target.id.split("-");
		var row = $('#row-' + split[1]);
		var folder = DefaultFolders.findOne({_id: split[1]});
		Meteor.call('removeFolder', folder, function (error, result) {});
	}
});

Template.manageFolders.helpers({
	folders: function () {
		return DefaultFolders.find({}, {sort: {name: 1}});
	}
});

Template.manageFolders.rendered = function () {
	confirmDelete();
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
					var folder = DefaultFolders.findOne({_id: split[1]});
					Meteor.call('removeFolder', folder, function (error, result){});
				}
			}
		}
}

function updateView(searchValue){
		if(searchValue == undefined || searchValue == null || searchValue == ""){
		folders = DefaultFolders.find({});
		folders.forEach(function (folder) {
			$('#' + "row-" + folder._id).show();
		});
	}else {
		folders = DefaultFolders.find({});
		folders.forEach(function (folder) {
			searchStrings = searchValue.trim().split(" ");
			var found = true;
			for (var i = 0; i < searchStrings.length; i++) {
				if(folder.name.toLowerCase().indexOf(searchStrings[i].toLowerCase() ) === -1){
					found = false;
				}
			}

			if(found){
				$('#' + "row-" + folder._id).show();			
			}

			if(!found){
				$('#' + "row-" + folder._id).hide();			
			}

		});
	}
}

Template.manageFolders.events({

	'click .def-click': function(event, ui) {
  		var splitId = ($(event)[0].target.id).split("-");
  		var id = splitId[1];
  		folder = DefaultFolders.findOne({_id: id});
  		var empType = findEmpType(splitId[0]);
  		var idString = '#'+splitId[0]+ '-'+id;
  		if($(idString).is(":checked")){
  			folder.permissions[folder.permissions.length] = empType;
  		} else {
  			folder.permissions.splice($.inArray(empType, folder.permissions),1);

  		}
  		Meteor.call('updateFolder', folder, function (error, id) {
				if (error) {
	           	} 
	           	else {
	           	}
	        });
	},
});

function validateRow(dataRows){
	var returnValue = true;
	for (var i = 0; i < dataRows.length; i++) {
		if(i>0){
			var dataRow = $(dataRows[i]);
			dataRow.find('.valCheck').remove();
			if(dataRow.hasClass('String')){
				var dataVal = $(dataRow).find('input').val();
				if($(dataRow).find('input').val().length < 1){
					dataRow.html(dataRow.html() + '<i class="valCheck fa fa-times fa-2x redX" title="Need to fill in a value"></i>');
					returnValue = false;
				} else if (dataRow.hasClass('Unique')){
					if(DefaultFolders.findOne({name: dataVal}) && dataVal !== originalName){
						dataRow.html(dataRow.html() + '<i class="valCheck fa fa-times fa-2x redX" title="Please use a Unique Name"></i>');
						returnValue = false;
					}
				} else {
					$(dataRow).append('<i class="valCheck fa fa-check fa-2x greenCheck"></i>');
				}
			}
		}
	}
	return returnValue;
}
