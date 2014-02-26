Template.manageFolders.events({
	'click #defBtn': function (){
		$("#addDefFolder").modal('show');
	},

	'click .def-click': function(event, ui) {
  		var splitId = ($(event)[0].target.id).split("-");
  		var id = splitId[1];
  		folder = Folders.findOne({_id: id});
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

Template.manageFolders.helpers({
	folders: function () {
		return Folders.find({}, {sort: {name: 1}});
	},

	officeManager: function () {
		if($.inArray("Office Manager", this.permissions) > -1){
			return true;
		} else{
			return false;
		}
	},

	employee: function () {
		if($.inArray("Employee", this.permissions) > -1){
			return true;
		} else{
			return false;
		}
	},

	client: function () {
		if($.inArray("Client", this.permissions) > -1){
			return true;
		} else{
			return false;
		}
	},

	subTrade: function () {
		if($.inArray("Sub-Trade", this.permissions) > -1){
			return true;
		} else{
			return false;
		}
	}
});

function findEmpType(empString){
	if(empString === "manager"){
		return "Office Manager";
	} else if (empString === "employee"){
		return "Employee";
	} else if(empString === "client"){
		return "Client";
	} else if (empString === "sub"){
		return "Sub-Trade";
	}
	return "";
}