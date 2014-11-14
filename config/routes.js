module.exports = function(app,config,passport){

  var crud = require('../app/controllers/crud');
  var tag = require('../app/controllers/tags');
  var content = require('../app/controllers/content');
  var collection = require('../app/controllers/collection');
  var target = require('../app/controllers/target');
  var ensureAuthenticated = app.ensureAuthenticated;

// GET /auth/google
//   Use passport.authenticate() as middleware. The first step in Google authentication will
//   redirect the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'] }),
    function(req, res){
      // The request will be redirected to Google for authentication, so this
      // function will not be called.
    });

// GET /auth/google/callback
//   Using passport.authenticate() as route middleware.  If authentication fails,
//   the user will be redirected back to the login page.  Otherwise, the primary
//   route function function will be called, which, in this example, will redirect
//   the user to the home page.
  app.get('/auth/google/callback',
    passport.authenticate('google', { successRedirect: '/admin',
      failureRedirect: '/login' }));


  app.get('/admin', ensureAuthenticated, crud.index);
  app.get('/admin/tag/view', ensureAuthenticated, crud.tagIndex);
  app.get('/admin/content/view', ensureAuthenticated, crud.contentIndex);
  app.get('/admin/form/collection', ensureAuthenticated, crud.index);
  app.get('/admin/form/collection/create', ensureAuthenticated, crud.collCreate);
  app.get('/admin/form/collection/update/:id', ensureAuthenticated, crud.collUpdate);
  app.get('/admin/form/tag/create', ensureAuthenticated,  crud.tagCreate);
  app.get('/admin/form/tag/update/:id', ensureAuthenticated, crud.tagUpdate);
  app.get('/admin/form/content/update/:id', ensureAuthenticated,  crud.contentUpdate);

  app.get('/rest/taglist', tag.tagList);
  app.get('/rest/contentlist', content.getTypeList);
  app.get('/rest/collection/bytype/:id', collection.collectionByTypeId);
  app.get('/rest/collection/bytag/:id', collection.collectionByTagId);
  app.get('/rest/getEad/:id/:fld', collection.getEadBySubject);
  app.get('/rest/getDspaceCollections', collection.getDspaceCollections);
  app.use('/rest/tag/getInfo/:id', tag.getTagInfo);
  app.use('/rest/type/getInfo/:id', content.getTypeInfo);
  app.use('/rest/subjects', tag.getSubjects);
  app.use('/rest/types', content.getTypeList);
  app.use('/rest/getBrowseList/:collection', collection.browseList);
  app.use('/rest/collection/byId/:id', collection.collectionById);

  // passing application configuration to imageUpdate controller.
  app.post('/admin/collection/image', ensureAuthenticated, function (res, req) {
    collection.updateImage(res, req, config)
  });
  app.get('/admin/collection/remove/tag/:collid/:tagid', ensureAuthenticated, collection.removeTag);
  app.get('/admin/collection/delete/:id', ensureAuthenticated, collection.delete);
  app.post('/admin/collection/tag', ensureAuthenticated, collection.addTag);
  app.post('/admin/collection/type', ensureAuthenticated, collection.addType);
  app.post('/admin/collection/create', ensureAuthenticated, collection.create);
  app.post('/admin/collection/update', ensureAuthenticated, collection.update);
  app.get('/admin/tag/delete/:id', ensureAuthenticated, tag.delete);
  app.post('/admin/tag/create', ensureAuthenticated, tag.create);
  app.post('/admin/tag/update', ensureAuthenticated, tag.tagUpdate);
  app.get('/admin/target/create', target.create);
  app.post('/admin/content/create', content.create);
  app.post('/admin/content/update', ensureAuthenticated, content.contentUpdate);
  app.get('/admin/content/delete/:id', ensureAuthenticated, content.delete);
  app.get('/login',crud.login);

  app.get("/commons/", function(req, res) {
    res.sendFile(config.root + config.modulePath + '/index.html' )
  });
  app.get('/commons/partials/:name', function(req, res) {
    var name = req.params.name;
    res.sendFile(config.root + config.modulePath + '/partials/' +name + '.html');
  });

// If not part of the administrative interface, then return index.
  app.get('/commons/*', function(req, res) {
    res.sendFile(config.root + config.modulePath + '/index.html');
  });
};

