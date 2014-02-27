
Template.defaultFolder.helpers({
  createTime: function () {
    if(this.createdOn){
      return formatDate(this.createdOn);
    }
  },

  isChecked: function (data) {
    if($.inArray(data, this.permissions) > -1){
      return true;
    } else{
      return false;
    }
  }
});

Template.projectAdminItem.rendered = function(){
  $("[rel='tooltip']").tooltip();
};
