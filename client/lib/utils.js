formatDate = function(data) {
	var now = moment();
	var passedDate = moment(data);
	if(now.diff(passedDate, 'days')<8){
		return moment(data).fromNow();
	}
	return moment(data).format("MMMM Do, YYYY");

};

capitalizeFirstLetter = function(string){
	return string.charAt(0).toUpperCase() + string.slice(1);
};

checkImageType = function(fileType){
	if(fileType === "jpg" || fileType === "png" ||fileType === "gif" || fileType === "tiff" ||fileType === "bmp" || fileType === "svg"){
			console.log("inside if");
			return "s_web_page_white_picture_32";
	}

	return "s_web_page_white_text_32";
};