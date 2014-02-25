Template.createHRFieldModal.events({
    'click #HRField' : function (event) {
        clearBackground(event, "HRField");
    },
    'keypress' : function() {
        if(event.which === 13){
          clearBackground();
          createHR();
        }
    },
    'click #create-field': function () {
        createHR();
    }
});

function createHR(){
    var fieldName = $("#field-name").val();
    var defaultValue = $("#default-value").val();

    var field = {
        'fieldName': fieldName,
        'defaultValue': defaultValue
    };

    Meteor.call("HRField", field, function(){});
    
}