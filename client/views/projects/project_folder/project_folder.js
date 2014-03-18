Template.project_folder.events({
	'click .filename-link' : function(event){
	//Find the folder within the folder stack
	console.log("here");
	Router.go('inFolder', this);
},

'click .fileimage-link' : function(event){
	//Find the folder within the folder stack
	Router.go('inFolder', this);
}
});

Template.project_folder.helpers({
	getDate : function(event){
		var todaysDate = formatDate(this.updated);
		return todaysDate;
	},

	formatName : function(){
		if(this.name.length > 20){
			return this.name.substring(0,15) + "...";
		}else{
			return this.name;
		}
	}
});






