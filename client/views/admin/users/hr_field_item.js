
Template.HRFieldItem.events({
    'click .rightBtn' : function () {
    $(".b-project-item").attr("data-target", "");
      Router.go('projectPage', {"_id": this._id});
  }
});

Template.HRFieldItem.helpers({
  createTime: function () {
    if(this.createdOn){
      return formatDate(this.createdOn);
    }
  }
});

Template.projectAdminItem.rendered = function(){
  $("[rel='tooltip']").tooltip();
};
