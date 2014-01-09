formatDate = function(data) {
	var date = new Date(data);
	var month = date.getMonth() + 1;
	return date.getDate() + "/" + month + "/" + date.getFullYear();
};

capitalizeFirstLetter = function(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}