
Template.projectAdminItem.events({
    'click .goToBtn' : function () {
      Router.go('projectPage', {"_id": this._id});
  },

  'click .close-x' : function () {
    $(".b-project-item").attr("data-target", "");
    Session.set("projectId", this._id);
    $("#deleteProj").modal("show");
  }
});

Template.projectAdminItem.helpers({

  getTitle: function () {
    if(this.title.length > 43){
      return this.title.substring(0, 40)+"...";
    }
    return this.title;
  },
  /**
   * This function returns the id of the project
   * @return String A string containing the id of the project
   */
  projectId: function () {
    return this._id;
  },
  /**
   * Returns the time in a readable format
   * @return String A readable date string
   */
  convertedTime: function () {
    if(this.recentUpdate){
      return formatDate(this.recentUpdate.updateDate);
    }
  },

  createTime: function () {
    if(this.submitted){
      return formatDate(this.submitted);
    }
  },

  getPassword: function (){
    var returnString = "";
    if(this.password){
      for(var i = 0; i < this.password.length; i++){
        returnString += '*';
      }
    }
    return returnString;
  }
});

Template.projectAdminItem.rendered = function(){
  $("[rel='tooltip']").tooltip();
};
