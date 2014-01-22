Meteor.methods({
    createNewUser: function(options){
        var id = Accounts.createUser(options);
        Accounts.sendEnrollmentEmail(id);
        return id;
     }
});

Meteor.users.allow({
    update: function(userId, docs, fields, modifier) {
        return true;
    },

    remove: function() {
    	return true;
    }
});