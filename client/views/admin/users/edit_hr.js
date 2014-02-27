Template.editHR.events({
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
					dataRow.html("<input type='text' id='txtName' value='"+dataRow.html()+"'/>");
				} else if(dataRow.hasClass('Password')){
					dataRow.html("<input type='password' id='txtName' value='"+project.password+"'/>");
				} else if(dataRow.hasClass("Boolean")){
					if(dataRow.find("i").hasClass("fa-check")){
						dataRow.html("<input type='checkbox' id='checkbox' checked = 'true' />");
					}else{
						dataRow.html("<input type='checkbox' id='checkbox' checked = 'false' />");
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
		var hrItem = HRData.findOne({_id: split[1]});

		confirmbutton.attr("disabled",true);
		button.attr("disabled", false);

		var row = $('#row-' + split[1]);
		var dataRows = row.find("td");

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

		//UPDATES PROJECT!!
		hrItem.fieldName = $(dataRows[1]).html();
		hrItem.defaultValue = $(dataRows[2]).html();

		Meteor.call('HRFieldUpdate', hrItem, function (error, result) {});
	},

	'click #addRow' : function(){
		if(!Session.get("NewRow")){
			Session.set("NewRow", true);
			$('#tableData').find("tbody").prepend(Template['emptyHRRow']());
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
						dataRow.html("<input type='checkbox' id='checkbox' checked = 'true' />");
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
		}else{
			alert("Already have a new Row, complete it before continuing.");
		}

	},

	'click #CompleteRow' : function() {
		var completedRow = $($('#tableData').find("tbody").find("tr")[0]);
		//INSERT DATA HERE

		var dataRows = completedRow.find("td");

		var item = {
			fieldName: $(dataRows[1]).find('input').val(),
			defaultValue: $(dataRows[2]).find('input').val()
		}


		// the newly created Project's path after creating
		Meteor.call('HRField', item, function (error, id) {
			if (error) {
				console.log(error);
			}
		});

		$(completedRow).remove();

		Session.set("NewRow", false);

	},

	'click #deleteRow' : function() {
		var newRow = $($('#tableData').find("tbody").find("tr")[0]).remove();
		Session.set("NewRow", false);
	},

	'click .manageProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");

		var projectID = split[1];
		Router.go('projectAdminPage', {"_id": split[1]});
		

	},

	'click .deleteProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");
		var row = $('#row-' + split[1]);
		var hrItem = HRData.findOne({_id: split[1]});
		Meteor.call('HRFieldRemove', hrItem, function (error, result) {});
	}
});

Template.editHR.helpers({
	/**
	 * Finad all projects and give them an integer rank for animation
	 * @return Collection Returns all projects sorted by update time with an integer ranking
	 */
	hrFields: function() {
    	return HRData.find({}, {sort: {fieldName: 1}});
		
	}
});

function updateView(searchValue){
		if(searchValue == undefined || searchValue == null || searchValue == ""){
		hrFields = HRData.find({});
		hrFields.forEach(function (HRField) {
			$('#' + "row-" + HRField._id).show();
		});
	}else {
		hrFields = HRData.find({});
		hrFields.forEach(function (HRField) {
			searchStrings = searchValue.trim().split(" ");
			var found = true;
			for (var i = 0; i < searchStrings.length; i++) {
				if(HRField.fieldName.toLowerCase().indexOf(searchStrings[i].toLowerCase() ) === -1){
					found = false;
				}
			}

			if(found){
				$('#' + "row-" + HRField._id).show();			
			}

			if(!found){
				$('#' + "row-" + HRField._id).hide();			
			}

		});
	}
}
