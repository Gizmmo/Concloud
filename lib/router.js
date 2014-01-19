//Set Global Templates
Router.configure({

	layoutTemplate: "logged",
	notFoundTemplate: "notFound"
});

//Map Individual URLS
Router.map(function () {


	this.route('contactUs', {
		path: '/contactUs', // match the root path
		layoutTemplate: "static"
	});

	this.route('about',{
		path: '/about', // match the root path
		layoutTemplate: 'static'
	});

	this.route('projectsList', {
		path: '/projects' // match the root path
	});

	this.route('faq', {
		path: '/faq', // match the root path
		layoutTemplate: 'static'
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

	this.route('reports', {
		path: '/reports' // match the root path
	});

	this.route('manageEmployeeList', {
		path: '/manageEmployees' // match the root path
	});

		this.route('userList', {
		path: '/users' // match the root path
	});


		this.route('userCreate', {
		path: '/createUser' // match the root path
	});
		

	this.route('projectPage', {
		path: '/projects/:_id',// match the root path
		data: function() {
			//Return the project from the ID
			var project = Projects.findOne({_id: this.params._id});
			Session.set("currentProject", this.params._id);
			return project;
		}
	});

	this.route('userPage', {
		path: '/users/:_id',// match the root path
		data: function() {
			//Return the user from the ID
			return Meteor.users.findOne({_id: this.params._id});

		}
	});

	this.route('dashboard', {
		path: '/', // match the root path
	});

	this.route('splash', {
		path: '/',
		layoutTemplate: 'static'
	});


});


//Check if user is logged in, if not, load Splash template.
var requireLogin = function() {
	if (! Meteor.user()) {
		if (Meteor.loggingIn())
			this.render(this.loadingTemplate);
		else
			Router.go('splash');
		this.stop();
	}
};

//Force all pages to load at the top of the page, and remove any styles to body
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