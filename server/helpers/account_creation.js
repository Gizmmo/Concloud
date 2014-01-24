Meteor.methods({
    createNewUser: function(options){
        var id = Accounts.createUser(options);
        Accounts.sendEnrollmentEmail(id);
        return id;
     }
});