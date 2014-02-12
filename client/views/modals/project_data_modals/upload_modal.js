var sf = new SmartFile({});

Template.uploadModal.helpers({
  onFile : function() {
    return (Session.get("uploadType")==="file");
  }
});

Template.uploadModal.events({
  'click #uploadData' : function (event) {
    clearBackground(event, "uploadData");
  },
  'keypress' : function() {
    if(event.which === 13){
      clearBackground();
      upload();
    }
  },
    /**
     * Upload file to Smart file and to our database
     * @param  {[type]} e        event returned
     * @param  {[type]} template Parameter of the used template
     */
     'click #smartfile': function (e, template) {
      upload();
     },
      'click #file-upload' :function () {
            if(Session.get("uploadType") != "file"){
              Session.set("uploadType", "file");
              $('#file-li').addClass('active');
              $('#folder-li').removeClass('active');
            }
          },

     'click #folder-upload' : function () {
            if(Session.get('uploadType') != 'folder'){
              Session.set('uploadType', 'folder');
              $('#folder-li').addClass('active');
              $('#file-li').removeClass('active');
            }
          }
});

function upload() {       

      var files = template.find('#upload-folder').files;
      var projectData = Projects.findOne({_id: Session.get("currentProject")});
      counter = 0;
      if(files.length !== 0){
        console.log(files);
       for (i = 0; i< files.length; i++) {
        Session.set("uploadingData", true);
        uploadFile(files[i],projectData);
        addToDatabase(files[i],projectData);
        runUpdate();
       }

    Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);


     }else{

      var file = template.find('#upload-file').files[0];
      if(getFolderStack().length > 0){
       Session.set("uploadingData", true);
       uploadFile(file,projectData);
       addToDatabase(file,projectData);
       runUpdate();
       Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);
               }else{
                 alert("You can only upload a file within a folder.");
               }
             }
      }


function uploadFile(file,projectData){
  sf.upload(file, {
    file: file.name,
    path : getDirectoryFromStack(projectData, true)
  },

  function (err, res){
    if (err) {
     console.log("upload failed", err);
     return;
   }
   
  });
}


  function addToDatabase(file, projectData){
     var folderData = getFolderData(projectData);

    //Find the document type by splitting on the .
    var nameSplit = file.name.split(".");
    var type = "";
    var fileName = file.name;
    if(nameSplit.length > 0){
      //get type after .
      type = nameSplit[1];
      //Collect file name without .
      fileName = nameSplit[0];
    }else{
      type = "none";
    }

    //Create File
    folderData.files[fileName] = createFile(fileName, type);
  }

  function runUpdate(){
    Session.set("uploadingData", false);
  }

