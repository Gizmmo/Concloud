var sf = new SmartFile();
var exchange = "https://app.smartfile.com/api/2/path/exchange/";
var key = "XFrwhXrnX5YdEGucym71yWnzP1EFpW";
var password = "1z3CPFe6gn8BuEs0cJjLCLtoMBnZn8";

sf.configure({
    key: key,
    password: password,
    basePath: "",
    publicRootUrl: "https://file.ac/CSB6GqDSJvM/"
});

sf.onUpload = function (result, options) {
    //result is the smartfile api JSON response
    console.log("File uploaded to " + result[0].path);
};

sf.onUploadFail = function (error, options) {
    console.log("SmartFile returned error", error.statusCode, error.detail);
};



Meteor.methods({
	getSmartFiles : function () {
		return sf.ls("");
	},

	exchangeSmartFiles : function(pathName) {
		console.log("made it to exchangeSmartFiles");
		console.log(sf._getApiAuthString());
		
		try{
			var httpResponse = HTTP.post(exchange,{auth:sf._getApiAuthString(), data: {path: pathName}});
			var url = httpResponse.data.url;
			console.log(url);
			return url;
		// 	auth: key+":"+password,
		// 	data : {
		// 	path: "Questions for Concord.doc",
		// 	mode: "r",
		// 	expires: "20",
		// },
			
		// 	redirect : "http://www.cnn.com",
		// 	fetch: "Questions for Concord.doc",
		
		// }, function(){

		// 	console.log("Completed Post");
		// });
		// console.log(httpResponse.data);
		}catch(e){
			console.log(e.message);
		}

	},

	downloadFile : function(fileName, window) {
		
		return "https://file.ac/CSB6GqDSJvM/" + fileName + "?download=true";
	},

	createDirectory : function (name) {
		sf.mkdir(name);
	},

	remove : function (name) {
		sf.rm(name);
	}
});