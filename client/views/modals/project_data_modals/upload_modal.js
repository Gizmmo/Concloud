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
     }
          
 });

function upload() {       
          var files = template.find('#upload').files;
          var projectData = Projects.findOne({_id: Session.get("currentProject")});

          if(files.length > 1){
               console.log(files);
          }else{

          var file = files[0];
          console.log(file);
          if(folderStack.length > 0){
               Session.set("uploadingData", true);
               sf.upload(file, {
                    file: file.name,
                    path : getDirectoryFromStack(projectData, true)
               },

               function (err, res){
                    if (err) {
                         console.log("upload failed", err);
                         return;
                    }
                    Session.set("uploadingData", false);
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
                   }

                 //Create File
                 folderData.files[fileName] = createFile(fileName, type);
                 //Update Project
                 Meteor.call('updateProject', Session.get('currentProject'),projectData.folders);




               });
               console.log("Completed Uploding");
          }else{
               alert("You can only upload a file within a folder.");
          }
     }
     }
