Template.manageHR.events({
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

		var user = Meteor.users.findOne({_id: split[1]});
		for (var i = 0; i < dataRows.length; i++) {
			if(i>0){
				var dataRow = $(dataRows[i]);
				if(dataRow.hasClass('String')){
					dataRow.html("<input type='text' id='txtName' value='"+dataRow.html()+"'/>");
				} else if(dataRow.hasClass('Password')){
					dataRow.html("<input type='password' id='txtName' value=''/>");
				} else if (dataRow.hasClass("Selection")){
						var selectVal = dataRow.html();
						dataRow.html("<select name=''user-group' id ='user-create-group' class='groupSelect'><option value='Employee'>Employee</option><option value='Client''>Client</option><option value='Admin'>Office Manager</option><option value='Sub-Trade'>Sub-Trade</option></select>");
						var select = $(dataRow.find("select")).attr('id');
						$("#" + select +' option[value=' + selectVal +']').attr('selected', 'selected');
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
		var currentHR =  HR.findOne({userId: split[1]});

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

		var hrD= HRData.find({}, {sort: {fieldName: 1}}).fetch();
		var eachHeader = $($('#tableData').find("thead").find("tr")[0]).find("th");

		for (var n = 0; n < dataRows.length; n++){
			var dataRow = $(dataRows[n]);
			if(dataRow.hasClass("hrVal")){
				if(currentHR){
					if(currentHR.hrValues){
						var name = $(eachHeader[n]).html();
						var temp = "Not Found"
						for(var p = 0; p < currentHR.hrValues.length; p++){
							if(currentHR.hrValues[p].name === name){
								currentHR.hrValues[p].value = dataRow.html();
							}
						}
					}
				}
			}
		}

		Meteor.call('HRUpdate', currentHR, function (error, result) {});
	},

	'click #addRow' : function(){
		if(!Session.get("NewRow")){
			Session.set("NewRow", true);
			var newRow = $($('#tableData').find("tbody").find("tr")[0]).clone();
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
					}else if (dataRow.hasClass("Selection")){
						dataRow.html("<select name=''user-group' id ='user-create-group' class='groupSelect'><option value='Employee'>Employee</option><option value='Client''>Client</option><option value='Admin'>Office Manager</option><option value='Sub-Trade'>Sub-Trade</option></select>");;
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
		}else{
			alert("Already have a new Row, complete it before continuing.");
		}

	},

	'click #CompleteRow' : function() {
		var completedRow = $($('#tableData').find("tbody").find("tr")[0]);
		//INSERT DATA HERE

		var dataRows = completedRow.find("td");

        var time = new Date().getTime();
    	var fieldName = $("#field-name").val();
    	var defaultValue = $("#default-value").val();

    var field = {
        'fieldName': fieldName,
        'defaultValue': defaultValue
    };

    	Meteor.call("HRField", field, function(){});


	},

	'click #deleteRow' : function() {
		var newRow = $($('#tableData').find("tbody").find("tr")[0]).remove();
		Session.set("NewRow", false);
	},

	// 'click .manageProject' : function(event, template) {
	// 	event.preventDefault();
	// 	var split = event.target.id.split("-");

	// 	var projectID = split[1];
	// 	//Router.go('projectAdminPage', {"_id": split[1]});
		

	// },

	// 'click .deleteProject' : function(event, template) {
	// 	event.preventDefault();
	// 	var split = event.target.id.split("-");
	// 	var row = $('#row-' + split[1]);
	// 	// row.remove();
	// 	var projectID = split[1];
	// 	Meteor.users.remove({_id: projectID});
	// }
});

Template.manageHR.helpers({
	hrField: function () {
		return HRData.find({}, {sort: {fieldName: 1}});
	},
	hrName: function () {
		return HRData.find({}, {sort: {fieldName: 1}});
	},
	convertedTime: function () {
	 	if(this.profile.recent){
	 		if(this.profile.recent.lastLogin){
	 			return formatDate(this.profile.recent.lastLogin);
	 		}
	 	}
	 	return formatDate(new Date().getTime());
	 },
	 	users: function() {
	 	return Meteor.users.find({}, {sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
	 }
});

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
