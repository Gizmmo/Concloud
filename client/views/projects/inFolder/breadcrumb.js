Template.breadcrumb.events({
	'click .headerLink': function (event) {
		var found = Folders.findOne({_id: $(event.target).attr('id')});
		Router.go('inFolder', found);
	}
});