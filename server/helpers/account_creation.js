Meteor.methods({
    createNewUser: function(options){
        var id = Accounts.createUser(options);
        return id;
     }
});