var assert = require('assert');

suite('Projects', function() {
    test("in the server", function(done, server){
        server.eval(function(){
            Projects.insert({title:'New Project'});
            var docs = Projects.find().fetch();
            emit('docs', docs);
        });

        server.on('docs', function(docs){
            assert.equal(docs.length, 3);
            done();
        });
    
    });
});
