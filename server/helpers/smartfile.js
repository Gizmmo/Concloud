var sf = new SmartFile();

sf.configure({
    key: "XFrwhXrnX5YdEGucym71yWnzP1EFpW",
    password: "1z3CPFe6gn8BuEs0cJjLCLtoMBnZn8",
    basePath: ""
});

sf.onUpload = function (result, options) {
    //result is the smartfile api JSON response
    console.log("File uploaded to " + result[0].path);
};

sf.onUploadFail = function (error, options) {
    console.log("SmartFile returned error", error.statusCode, error.detail);
};