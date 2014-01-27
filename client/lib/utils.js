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
}