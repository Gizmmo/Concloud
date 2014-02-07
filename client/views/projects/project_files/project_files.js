Template.project_files.helpers({
	getDate : function(event){
		var todaysDate = formatDate(this.proData.fileUpdate.updateDate);
		return todaysDate;
	}
});