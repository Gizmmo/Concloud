Template.createHRFieldModal.events({
    'click #HRField' : function (event) {
        if($(event.target).attr('id')!=="create-field"){
            clearBackground(event, "HRField");
        }
    },
    'keypress' : function(event) {
        if(event.which === 13){
          createHR(event);
        }
    },
    'click #create-field': function (event) {
        createHR(event);
    }
});

function createHR(event){
    var fieldName = $("#field-name").val();
    var defaultValue = $("#default-value").val();

    var field = {
        'fieldName': fieldName,
        'defaultValue': defaultValue
    };

    Meteor.call("HRField", field, function(){});
    clearBackground(event, "HRField");
}