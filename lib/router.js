//Set Global Templates
Router.configure({

	layoutTemplate: 'logged',
	notFoundTemplate: "notFound"
});

//Map Individual URLS
Router.map(function () {


	this.route('contactUs', {
		path: '/contactUs' // match the root path
		
	});

	this.route('about',{
		path: '/about' // match the root path
	});

	this.route('projectsList', {
		path: '/projects' // match the root path
	});

	this.route('faq', {
		path: '/faq' // match the root path
	});

	this.route('projectCreate', {
		path: '/submit' // match the root path
	});

	this.route('accountManagement', {
		path: '/accountManagement' // match the root path
	});

	this.route('admin', {
		path: '/admin' // match the root path
	});

	this.route('projectPage', {
		path: '/projects/:_id',// match the root path
		data: function() {
			Session.set('currentProjectId', this.params._id);
		}
	});

	this.route('dashboard', {
		path: '/' // match the root path
	});


});


var requireLogin = function() {
	if (! Meteor.user()) {
		if (Meteor.loggingIn())
			this.render(this.loadingTemplate);
		else
			this.render('splash');
		this.stop();
	}
};

var loadAtTop = function() {
	window.scrollTo(0,0);
	var body = $('body');
	body.removeAttr('style'); //Static pages were being made larger by height attr.
};


Router.before(requireLogin, {except: ['splash','about','faq','contactUs']});
Router.load(loadAtTop); //Load all pages from the top of the page.
/**
 * Creates a global function to search for the current URL. This will be used
 * to determine which navbar <li> will be active.
 * @return String the url
 */
curPath = function() {
	c=window.location.pathname;
	var b=c.slice(0,-1);
	var a=c.slice(-1);
	if(b===""){
		return"/";
	}else{
		if(a=="/"){
			return b;
		}else{
			return c;
		}
	}
};