Template.project_files.helpers({
	getDate : function(event){
		var todaysDate = formatDate(this.updated);
		return todaysDate;
	},

	getImage : function(event){
		return checkImageType(this.type);
	},

	collectFileName : function(event){
		return this.name.split(this.type)[0];
	}
});