Template.manageHR.events({
	'keyup' : function () {
		updateView($("#search-field").val());
	},

	'click #defHRBtn': function (){
		$("#HRField").modal('show');
	},

	'click .updateData': function(event, ui) {
  		var splitId = ($(event)[0].target.id).split("-");
  		var id = splitId[1];
  		hrD = HRData.findOne({_id: id});
  		var idString = '#'+"default"+ '-'+id;
  		hrD.defaultValue = $(idString).val();
  		Meteor.call('HRFieldUpdate', hrD, function (error, id) {
				if (error) {
	           	} 
	           	else {
	           	}
	        });
	 },

	 'click .deleteBtn': function(event, ui){
	 	var splitId = ($(event)[0].target.id).split("-");
  		var id = splitId[1];
  		hrD = HRData.findOne({_id: id});
  		Meteor.call('HRFieldRemove', hrD, function (error, id) {
				if (error) {
	           	} 
	           	else {
	           	}
	        });
	 }
});

function updateView(searchValue){
		if(searchValue == undefined || searchValue == null || searchValue == ""){
		var hrDat = HRData.find({});
		hrDat.forEach(function (field) {
			$('#hr-' + field._id).show();
		});
	}else {
			var hrDat = HRData.find({});
			hrDat.forEach(function (field) {
			searchStrings = searchValue.trim().split(" ");
			var found = true;
			for (var i = 0; i < searchStrings.length; i++) {
				if(field.fieldName.toLowerCase().indexOf(searchStrings[i].toLowerCase() ) === -1){
					found = false;
				}
			}

			if(found){
				$('#hr-' + field._id).show();
			}

			if(!found){
				$('#hr-' + field._id).hide();
			}

		});
	}
}

Template.manageHR.helpers({
	hrField: function () {
		return HRData.find({}, {sort: {fieldName: 1}});
	},
});

