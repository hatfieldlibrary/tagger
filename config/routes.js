module.exports = function(app,config){

    var crud = require('../app/controllers/crud');
    var tag = require('../app/controllers/tags');
    var content = require('../app/controllers/content');
    var collection = require('../app/controllers/collection');
    var target = require('../app/controllers/target');

    app.get('/rest/taglist', tag.tagList);
    app.get('/rest/contentlist', content.getTypeList);
    app.get('/rest/collection/bytag/:id', collection.collectionByTagId);
    app.get('/rest/getEad/:id/:fld', collection.getEadBySubject);
    app.get('/rest/getDspaceCollections', collection.getDspaceCollections);
    app.use('/rest/tag/getInfo/:id', tag.getTagInfo);
    app.use('/rest/type/getInfo/:id', content.getTypeInfo);
    app.use('/rest/subjects', tag.getSubjects);
    app.use('/rest/types', content.getTypeList);
    app.use('/rest/getBrowseList', collection.browseList);
    app.use('/rest/collection/byId/:id', collection.collectionById);

    app.get('/', crud.index);
    app.get('/form/collection', crud.index);
    app.get('/form/collection/create', crud.collCreate);
    app.get('/form/collection/update/:id', crud.collUpdate);
    app.get('/form/tag/create', crud.tagCreate);
    app.get('/form/tag/update/:id', crud.tagUpdate);
    app.get('/form/content/update/:id', crud.contentUpdate);

    // passing application configuration to imageUpdate controller.
    app.post('/collection/image', function (res, req) {
        collection.updateImage(res, req, config)
    });
    app.get('/collection/remove/tag/:collid/:tagid', collection.removeTag);
    app.get('/collection/delete/:id', collection.delete);
    app.post('/collection/tag', collection.addTag);
    app.post('/collection/type', collection.addType);
    app.post('/collection/create', collection.create);
    app.post('/collection/update', collection.update);
    app.get('/tag/delete/:id', tag.delete);
    app.post('/tag/create', tag.create);
    app.use('/tag/view', tag.tagIndex);
    app.post('/tag/update', tag.tagUpdate);
    app.use('/target/create', target.create);
    app.use('/content/view', content.contentIndex);
    app.post('/content/create', content.create);
    app.post('/content/update', content.contentUpdate);
    app.get('/content/delete/:id', content.delete);

};
