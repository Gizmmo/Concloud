Template.project_files.helpers({
	getDate : function(event){
		var todaysDate = formatDate(this.proData.fileUpdate.updateDate);
		return todaysDate;
	},

	getImage : function(event){
		return checkImageType(this.proData.fileType);
	}
});