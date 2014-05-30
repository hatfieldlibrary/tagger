module.exports = function(app){

    var crud = require('../app/controllers/crud');
    var tag = require('../app/controllers/tags');
    var collection = require('../app/controllers/collection');
    var target = require('../app/controllers/target');

    app.get('/form/collection/create', crud.collCreate);
    app.get('/form/collection/tagger/:id', crud.collTagger);
    app.get('/form/tag/create', crud.tagCreate);
    app.post('/tag/create', tag.create);
    app.use('/tag/view', tag.index);
    app.post('/collection/create', collection.create);
    app.use('/target/create', target.create);

};
