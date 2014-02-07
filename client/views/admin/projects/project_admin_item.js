
Template.projectAdminItem.events({
    'click .rightBtn' : function () {
    $(".b-project-item").attr("data-target", "");
      Router.go('projectPage', {"_id": this._id});
  },

  'click .close-x' : function () {
    $(".b-project-item").attr("data-target", "");
    workingProjects.remove({_id: this._id});
    Projects.remove({_id: this._id});
  },

  'click' : function () {
    if(onProjectRoles){
      Router.go('projectAdminPage', {"_id": this._id});
    }
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

  badgerData: function () {
    if(onProjectDelete){
      return "badger-danger badger-left"
    }
    if(onProjectRoles){
      return "badger-warning badger-right"
    }
    return "badger-info badger-left";
  },

  dataToggle : function () {
    if(onProjectDelete){
      return "#deleteData"
    }
    if(onProjectRoles){
      return ""
    }
    return "#updateData";
  }
});

Template.projectAdminItem.rendered = function(){
  $("[rel='tooltip']").tooltip();
};
