Template.userList.events({
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
		var user = Meteor.users.findOne({_id: split[1]});

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

		var firstName = $(dataRows[2]).html();
		var lastName = $(dataRows[1]).html();
		var userGroup = $(dataRows[3]).html();
		Meteor.users.update({_id: split[1]}, {$set:{"profile.firstName": firstName, "profile.lastName": lastName, "profile.userGroup": userGroup}})
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
			var manageProject = $(dataRows[dataRows.length-1]).find("button.manageProject");
			$(dataRows[dataRows.length-1]).find("a.goToProject").remove();

			editProject.attr("disabled",true);
			completeProject.attr("disabled", false);
			manageProject.attr("disabled", true);

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
        var options = {
            email : $(dataRows[4]).find('input').val(),
            password : 'password',
                //Profile is the object within the user that can
                //be freely edited by the user
                profile : {
                    firstName : $(dataRows[2]).find('input').val(),
                    lastName: $(dataRows[1]).find('input').val(),
                    email: $(dataRows[4]).find('input').val(),
                    userGroup : $(dataRows[3]).find('select').val(),
                    joinDate: time,
                    recent: {
                        lastLogin: time,
                        lastProjectName: "None",
                        lastProjectID: "None"
                    }
                }
            }
        Meteor.call('createNewUser', options, function (error, id) {
            if(error){

            }else {
                Meteor.call("HREntry", {userId: id}, function (error, id){});
            }
        });
        $("#search-field").val("");

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
		//Router.go('projectAdminPage', {"_id": split[1]});
		

	},

	'click .deleteProject' : function(event, template) {
		event.preventDefault();
		var split = event.target.id.split("-");
		var row = $('#row-' + split[1]);
		// row.remove();
		var projectID = split[1];
		Meteor.users.remove({_id: projectID});
	}
});

Template.userList.helpers({
	users: function() {
	 	return Meteor.users.find({}, {sort : {"profile.lastName" : 1, "profile.firstName" : 1}});
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