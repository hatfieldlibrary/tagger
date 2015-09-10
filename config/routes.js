module.exports = function(app,config,passport){

  'use strict';

  var crud = require('../app/controllers/crud');
  var tag = require('../app/controllers/tags');
  var area = require('../app/controllers/area');
  var content = require('../app/controllers/content');
  var collection = require('../app/controllers/collection');
  var target = require('../app/controllers/target');
  var category = require('../app/controllers/category');
  var ensureAuthenticated = app.ensureAuthenticated;

  /*jshint unused:false*/

  // Use passport.authenticate() as middleware. The first step in Google authentication
  // redirects the user to google.com.  After authorization, Google
  // will redirect the user back to the callback URL /auth/google/callback
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'] }),
    function(req, res){
      // The request will be redirected to Google for authentication, so this
      // function will not be called.
    });

  // If authentication failed, redirect the login page.  Otherwise, redirect
  // to the admin page page.
  app.get('/auth/google/callback',
    passport.authenticate('google', { successRedirect: '/admin',
      failureRedirect: '/login' }));

  // Administration routes.
  app.get('/admin', ensureAuthenticated, crud.index);
  app.get('/login', crud.login);
  app.get('/admin/tag/view', ensureAuthenticated, crud.tagIndex);
  app.get('/admin/content/view', ensureAuthenticated, crud.contentIndex);

  // Collections
  app.get('/admin/collections', ensureAuthenticated, collection.index);

  // Categories
  app.get('/admin/category', ensureAuthenticated, category.getOverview);
  app.get('/rest/category/:id', ensureAuthenticated, category.getCategory);
  app.get('/rest/category/show/list', ensureAuthenticated, category.listCategories);
  app.get('/rest/category/byArea/:id', ensureAuthenticated, category.listCategoriesByArea);
  app.post('/rest/category/add', ensureAuthenticated, category.add);
  app.post('/rest/category/update', ensureAuthenticated, category.update);
  app.post('/rest/category/delete', ensureAuthenticated, category.delete);

  //unused category route
  app.get('/admin/category/view', ensureAuthenticated, crud.categoryIndex);


  app.get('/admin/area/view', ensureAuthenticated, crud.areaIndex);
  app.get('/admin/form/collection', ensureAuthenticated, crud.index);
  app.get('/admin/form/collection/create', ensureAuthenticated, crud.collCreate);
  app.get('/admin/form/collection/update/:id', ensureAuthenticated, crud.collUpdate);
  app.get('/admin/form/tag/create', ensureAuthenticated,  crud.tagCreate);
  app.get('/admin/form/tag/update/:id', ensureAuthenticated, crud.tagUpdate);
  app.get('/admin/form/area/update/:id', ensureAuthenticated, crud.areaUpdate);
  app.get('/admin/form/category/update/:id', ensureAuthenticated, crud.categoryUpdate);
  app.get('/admin/form/content/update/:id', ensureAuthenticated,  crud.contentUpdate);
  app.get('/admin/collection/remove/tag/:collid/:tagid', ensureAuthenticated, collection.removeTag);
  app.get('/admin/collection/remove/type/:collid/:type', ensureAuthenticated, collection.removeType);
  app.get('/admin/collection/delete/:id', ensureAuthenticated, collection.delete);
  app.post('/admin/collection/tag', ensureAuthenticated, collection.addTag);
  app.post('/admin/collection/type', ensureAuthenticated, collection.addType);
  app.post('/admin/collection/create', ensureAuthenticated, collection.create);
  app.post('/admin/collection/update', ensureAuthenticated, collection.update);
  // need to pass application configuration to imageUpdate controller.
  app.post('/admin/collection/image', ensureAuthenticated, function (res, req) {
    collection.updateImage(res, req, config);
  });
  app.get('/admin/tag/delete/:id', ensureAuthenticated, tag.delete);
  app.post('/admin/tag/create', ensureAuthenticated, tag.create);
  app.post('/admin/tag/update', ensureAuthenticated, tag.tagUpdate);
  app.post('/admin/area/create', ensureAuthenticated, area.create);
  app.post('/admin/area/update', ensureAuthenticated, area.update);
  app.get('/admin/area/delete/:id', ensureAuthenticated, area.delete);
  app.get('/admin/target/create', ensureAuthenticated, target.create);
  app.post('/admin/content/create', ensureAuthenticated, content.create);
  app.post('/admin/content/update', ensureAuthenticated, content.contentUpdate);
  app.get('/admin/content/delete/:id', ensureAuthenticated, content.delete);
  app.post('/admin/category/create', ensureAuthenticated, category.create);
  app.post('/admin/category/update', ensureAuthenticated, category.update);
  app.get('/admin/category/delete/:id', ensureAuthenticated, category.delete);
  app.post('/admin/category/link', ensureAuthenticated, category.addCategoryTarget);


  // used by admin
  app.get('/rest/taglist',               tag.tagList);
  app.get('/rest/contentlist',           content.getTypeList);

  // Public API routes. These return JSON.
  //app.get('/rest/taglist',               tag.tagList);
  //app.use('/rest/tag/getInfo/:id',       tag.getTagInfo);
  //app.use('/rest/subjects',              tag.getSubjects);
  //app.get('/rest/contentlist',           content.getTypeList);
  //app.use('/rest/types',                 content.getTypeList);
  //app.use('/rest/type/getInfo/:id',      content.getTypeInfo);
  //app.get('/rest/collection/bytype/:id', collection.collectionByTypeId);
  //app.get('/rest/collection/bytag/:id',  collection.collectionByTagId);
  //app.get('/rest/getEad/:id/:fld',       collection.getEadBySubject);
  //app.get('/rest/getDspaceCollections',  collection.getDspaceCollections);
  //app.use('/rest/getBrowseList/:collection', collection.browseList);

  //existing
  app.use('/rest/collection/byId/:id',      collection.collectionById);
  app.use('/rest/getBrowseList/:collection', collection.browseList);
  // new
  app.use('/rest/collections/all',          collection.allCollections);
  app.use('/rest/collection/byArea/:id',    collection.collectionsByArea);
  app.use('/rest/collection/bySubject/:id/area/:areaId', collection.collectionsBySubject);
  app.use('/rest/subjects/byArea/:id',      tag.subjectsByArea);
  app.use('/rest/area/byId/:id',            area.areaById);
  app.use('/rest/areas',                    area.getAreas);
  app.use('/rest/collection/tags/:id',   collection.tagsForCollection);
  app.use('/rest/collection/types/:id',   collection.typesForCollection);
 // app.use('/rest/categories/byArea/:areaId', category.categoriesByArea);

  /* Static Angularjs module routes.  Used by the Academic Commons public site. */
  // request for partials
  app.get('/partials/:name', function(req, res) {

    var name = req.params.name;

    res.sendFile(
      config.root +
      config.modulePath +
      '/partials/'  +
      name +
      '.html'
    );
  });


  app.get('/info/data/:name', function(req, res) {

    var name = req.params.name;

    res.sendFile(
      config.root +
      config.modulePath +
      '/info/data/' +
      name +
      '.html'
    );
  });

  app.get('/info/student/:name', function(req, res) {

    var name = req.params.name;

    res.sendFile(
      config.root +
      config.modulePath +
      '/info/student/' +
      name +
      '.html'
    );
  });

  app.get('/info/:name', function(req, res) {

    var name = req.params.name;

    res.sendFile(
      config.root +
      config.modulePath +
      '/info/' +
      name +
      '.html'
    );
  });

  // requests for an angular directive template.
  app.get('/components/:name', function(req, res) {

    var name = req.params.name;

    res.sendFile(
      config.root +
      config.modulePath +
      '/components/' +
      name
    );
  });


  app.get('/commons/error/:name', function(req, res) {

    var name = req.params.name;

      res.sendFile(
        config.root +
        config.modulePath +
        '/error/' +
        name +
        '.html'
      );
  });

  // This catch-all is required by html5mode.
  app.get('/commons', function(req, res) {

    res.sendFile(
      config.root +
      config.modulePath +
      '/index.html'
    );
  });

  // This catch-all is required by html5mode.
  app.get('/commons/*', function(req, res) {

    res.sendFile(
      config.root +
      config.modulePath +
      '/index.html'
    );
  });

};

