var sf = new SmartFile();

sf.configure({
    key: "XFrwhXrnX5YdEGucym71yWnzP1EFpW",
    password: "1z3CPFe6gn8BuEs0cJjLCLtoMBnZn8",
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