module.exports = function(app,config,passport){

    var crud = require('../app/controllers/crud');
    var tag = require('../app/controllers/tags');
    var content = require('../app/controllers/content');
    var collection = require('../app/controllers/collection');
    var target = require('../app/controllers/target');
    var ensureAuthenticated = app.ensureAuthenticated;

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

    app.get('/', ensureAuthenticated, crud.index);
    app.get('/tag/view', ensureAuthenticated, crud.tagIndex);
    app.get('/content/view', ensureAuthenticated, crud.contentIndex);
    app.get('/form/collection', ensureAuthenticated, crud.index);
    app.get('/form/collection/create', ensureAuthenticated, crud.collCreate);
    app.get('/form/collection/update/:id', ensureAuthenticated, crud.collUpdate);
    app.get('/form/tag/create', ensureAuthenticated,  crud.tagCreate);
    app.get('/form/tag/update/:id', ensureAuthenticated, crud.tagUpdate);
    app.get('/form/content/update/:id', ensureAuthenticated,  crud.contentUpdate);

    // passing application configuration to imageUpdate controller.
    app.post('/collection/image', ensureAuthenticated, function (res, req) {
        collection.updateImage(res, req, config)
    });
    app.get('/collection/remove/tag/:collid/:tagid', ensureAuthenticated, collection.removeTag);
    app.get('/collection/delete/:id', ensureAuthenticated, collection.delete);
    app.post('/collection/tag', ensureAuthenticated, collection.addTag);
    app.post('/collection/type', ensureAuthenticated, collection.addType);
    app.post('/collection/create', ensureAuthenticated, collection.create);
    app.post('/collection/update', ensureAuthenticated, collection.update);
    app.get('/tag/delete/:id', ensureAuthenticated, tag.delete);
    app.post('/tag/create', ensureAuthenticated, tag.create);c
    app.post('/tag/update', ensureAuthenticated, tag.tagUpdate);
    app.get('/target/create', target.create);
    app.post('/content/create', content.create);
    app.post('/content/update', ensureAuthenticated, content.contentUpdate);
    app.get('/content/delete/:id', ensureAuthenticated, content.delete);

    app.get('/login',crud.login);



    // GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
    app.get('/auth/google',
        passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'] }),
        function(req, res){
            // The request will be redirected to Google for authentication, so this
            // function will not be called.
        });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
    app.get('/auth/google/callback',
        passport.authenticate('google', { successRedirect: '/',
            failureRedirect: '/login' }));


};
