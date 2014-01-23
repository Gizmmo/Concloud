Handlebars.registerHelper('arrayify', function(obj) {
  return arrayify(obj); 
});

arrayify = function(obj){
   result = [];
   for(var key in obj) {
       result.push({proData:obj[key]});
   }
   return result; 
};