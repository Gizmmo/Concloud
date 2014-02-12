clearBackground = function(event, divName){
	if(event.which === 13){
		$('.modal-backdrop').remove();
	}else{
		if($(event.toElement).attr("id") == divName){
			$('.modal-backdrop').remove();
		}
		if($(event.toElement).attr("class") == "close"){
			$('.modal-backdrop').remove();
		}
		var foundClasses = $(event.toElement).attr("class").toString().split(" ");
		for(i = 0; i < foundClasses.length; i++){
			if( foundClasses[i] == "closeModal"){
				$('.modal-backdrop').remove();
			}
			if( foundClasses[i] == "submitModal"){
				$('.modal-backdrop').remove();
			}
		}
	}
}

Deps.autorun(function(){
	if(Meteor.user() && !Session.get("LoggedIn")){
		Router.go("dashboard");
	}
});