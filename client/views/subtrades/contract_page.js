Template.contractPage.helpers({
	/**
	 * Returns the time in a readable format
	 * @return String A readable date string
	 */
	convertedTime: function () {
		if(this.recentUpdate){
			return formatDate(this.recentUpdate.updateDate);
	}
	}
});