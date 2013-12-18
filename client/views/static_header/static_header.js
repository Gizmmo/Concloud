/**
 * Determine if current link should be active. Uses the curPath() from router.js.
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
Handlebars.registerHelper('active', function(path) {
    return curPath() == path ? 'nav-callout' : 'gray';
});


Template.staticHeader.helpers({
	navtype: function() {
		if(Router.current().route.name === 'dashboard'){
			return '';
		}
		else{
			return 'navbar-static-top';
		}
	}
});