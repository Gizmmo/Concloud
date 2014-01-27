createBigBoxNotification = function(title) {
	metroNotifications();
	console.log("YayQ");
  $.bigBox({
        title:"Project Update",
        content: title + " has been updated",
        timeout: 5000,
      });
};