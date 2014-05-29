module.exports = function(app){

   var tag = require('../app/controllers/tags');
   app.use('/tag/create', tag.create);
   app.use('/tag/view', tag.index);

   var collection = require('../app/controllers/collection');
    app.use('/collection/create', collection.create);

   var target = require('../app/controllers/target')
    app.use('/target/create', target.create);
};
