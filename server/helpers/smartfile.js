var sf = new SmartFile();
var exchange = "https://app.smartfile.com/api/2/path/exchange/";
var compress = "https://app.smartfile.com/api/2/path/oper/compress/";
var info = "https://app.smartfile.com/api/2/path/info/?children=on";
var key = "XFrwhXrnX5YdEGucym71yWnzP1EFpW";
var password = "1z3CPFe6gn8BuEs0cJjLCLtoMBnZn8";
Meteor.startup(function () {
	Future = Npm.require('fibers/future');
})
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

	compressSmartFiles : function(pathName, user){
		
		try{
			var splitName = pathName.split(['/']);
			var fullName = splitName[splitName.length-1]+'.zip';
			var tmp = user + Date.now();
			sf.mkdir(tmp);
			var future = new Future();
			console.log(pathName);
			var httpResponse = HTTP.post(compress,{
				auth:sf._getApiAuthString(),
			params : {
				path: pathName,
				name: fullName,
				dst : tmp
			},
				headers: {
					"Content-Type" : 'application/x-www-form-urlencoded'
				}
			}, function(err, res){
				if(err){
					console.log(err);
				}
				else{
					Meteor.setTimeout(function(){
						console.log("remove " + tmp);
						sf.rm(tmp);
					},60000);
					future['return'](tmp+"/"+fullName);
				}
			});

			return future.wait();

		}catch(e){
			console.log(e.message);
		}
	},

	smartFileSize : function(){
		this.unblock();
		try{
			var httpResponse = HTTP.get(info,{
				auth:sf._getApiAuthString(),
				data: {
				}
			});
			var children = httpResponse.data.children;
			var size = 0;
			for (var i = 0; i < children.length; i++) {
				size += children[i].size;
			}
			return (size/1000/1000/1000).toFixed(2);

		}catch(e){
			console.log(e.message);
		}
	},

	exchangeSmartFiles : function(pathName) {
		this.unblock();
		try{
			var httpResponse = HTTP.post(exchange+"?download=true",{
				auth:sf._getApiAuthString(),
				data: {
					path: pathName
				},
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