Template.project_files.helpers({
	getDate : function(event){
		var todaysDate = formatDate(this.proData.fileUpdate.updateDate);
		return todaysDate;
	},

	getImage : function(event){
		return checkImageType(this.proData.fileType);
	},

	collectFileName : function(event){
		return this.proData.fileName.split(this.proData.fileType)[0];
	}
});