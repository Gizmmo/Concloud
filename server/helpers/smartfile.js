var sf = new SmartFile();
var exchange = "https://app.smartfile.com/api/2/path/exchange/";
var key = "XFrwhXrnX5YdEGucym71yWnzP1EFpW";
var password = "1z3CPFe6gn8BuEs0cJjLCLtoMBnZn8";

sf.configure({
	key: key,
	password: password,
	basePath: ""
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
		try{
			var httpResponse = HTTP.post(exchange+"?download=true",{
				auth:sf._getApiAuthString(),
				data: {
					path: pathName
				},
				download:true
				// headers: {
				// 	"Content-Disposition": "attachment"
				// }
			});
			var url = httpResponse.data.url;
			return url;

		}catch(e){
			console.log(e.message);
		}

	},

	/**
	 * Create the inital Project directory in smart file
	 * @param  {[String]} projectName Project Name, used for creation in smart file
	 */
	 createNewProjectDirectories : function(projectName, folders) {
	 	console.log(folders);
	 	sf.mkdir(projectName);
	 	folders.forEach(function (folder) {
	 		sf.mkdir(projectName + "/" + folder.name);
	 	});
	 },

	 createDirectory : function (name) {
	 	sf.mkdir(name);
	 },

	 remove : function (name) {
	 	sf.rm(name);
	 }
	});