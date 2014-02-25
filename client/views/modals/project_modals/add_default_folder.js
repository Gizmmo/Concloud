Template.addDefaultFolder.events({

    'click #createData' : function (event) {
        if($(event.target).attr('id')!=="create-default-folder"){
            clearBackground(event, "addDefFolder");
        }
    },

    'keypress' : function(event) {
        if(event.which === 13){
          createNewFolder(event);
        }
    },
		/**
	 * Creates a projects and inserts it in the project collection
	 * @param  Event event The event of clicking the button
	 * @return void
	 */
	 'click #create-default-folder': function (event) {
        createNewFolder(event);
    }
});

function createNewFolder(event){
    var privilages = [];
    if($("#emp-check").is(":checked")){
        privilages[privilages.length] = "Employee";
    }
    if($("#manager-check").is(":checked")){
        privilages[privilages.length] = "Office Manager";
    }
    if($("#client-check").is(":checked")){
        privilages[privilages.length] = "Client";
    }
    if($("#sub-check").is(":checked")){
        privilages[privilages.length] = "Subtrade";
    }
    folder = {
        name: $("#folder-name").val(),
        permissions: privilages
    }
    Meteor.call('addFolder', folder, function(err, res){} );
    clearBackground(event, "addDefFolder");
    $("#addDefFolder").modal('hide');
}