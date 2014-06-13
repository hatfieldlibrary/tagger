module.exports = function(app,config){

    var crud = require('../app/controllers/crud');
    var tag = require('../app/controllers/tags');
    var collection = require('../app/controllers/collection');
    var target = require('../app/controllers/target');

    app.get('/rest/taglist', tag.tagList);
    app.get('/rest/collection/bytag/:id', collection.collectionByTagId);
    app.get('/rest/getEad/:id/:fld', collection.getEadBySubject)
    app.get('/', crud.index);
    app.get('/form/collection', crud.index);
    app.get('/form/collection/create', crud.collCreate);
    app.get('/form/collection/update/:id', crud.collUpdate);
    // passing application configuration to imageUpdate controller.
    app.post('/collection/image', function (res, req) {
        collection.updateImage(res, req, config)
    });
    app.get('/collection/remove/tag/:collid/:tagid', collection.removeTag);
    app.get('/collection/delete/:id', collection.delete);
    app.post('/collection/tag', collection.addTag);
    app.post('/collection/create', collection.create);
    app.post('/collection/update', collection.update);
    app.get('/form/tag/create', crud.tagCreate);
    app.get('/form/tag/update/:id', crud.tagUpdate);
    app.get('/tag/delete/:id', tag.delete);
    app.post('/tag/create', tag.create);
    app.use('/tag/view', tag.tagIndex);
    app.post('/tag/update', tag.tagUpdate);
    app.use('/target/create', target.create);

};
