Template.contactUs.events({
	'click sendmessage': function () {


		var name = $("#contact_form_name").val();
		var email = $("#contact_form_email").val();
		var phone = $("#contact_form_phone_number").val();
		var message = $("#form_message").html();
		console.log(name);
		// Meteor.call('sendEmail',
  //           'info@concordprojects.com',
  //           'bob@example.com',
  //           'Contact Us Form',
  //           '.');
	}
});