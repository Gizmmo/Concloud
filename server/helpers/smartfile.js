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
			console.log(url);
			return url;

		}catch(e){
			console.log(e.message);
		}

	},

	/**
	 * Create the inital Project directory in smart file
	 * @param  {[String]} projectName Project Name, used for creation in smart file
	 */
	 createNewProjectDirectories : function(projectName) {
	 	sf.mkdir(projectName);
	 	sf.mkdir(projectName + "/Change Orders");
	 	sf.mkdir(projectName + "/Consultant");
	 	sf.mkdir(projectName + "/Contracts and PO's");
	 	sf.mkdir(projectName + "/Daily Log's");
	 	sf.mkdir(projectName + "/Drawings");
	 	sf.mkdir(projectName + "/Estimates");
	 	sf.mkdir(projectName + "/Inspections, Reports & Tests");
	 	sf.mkdir(projectName + "/Legal, Civic & Utility");
	 	sf.mkdir(projectName + "/Minutes of Meetings");
	 	sf.mkdir(projectName + "/Owner");
	 	sf.mkdir(projectName + "/PCN's");
	 	sf.mkdir(projectName + "/Pictures");
	 	sf.mkdir(projectName + "/Preliminary");
	 	sf.mkdir(projectName + "/Safety");
	 	sf.mkdir(projectName + "/Shop Drawings");
	 	sf.mkdir(projectName + "/Subtrades");
	 },

	 createDirectory : function (name) {
	 	sf.mkdir(name);
	 },

	 remove : function (name) {
	 	sf.rm(name);
	 }
	});