'use strict';

var async = require('async');

exports.overview = function(req, res) {
  console.log(req.user);
  res.render('categoryOverview', {
    title: 'Categories',
    user: req.user.displayName,
    picture: req.user._json.picture
  });
};

exports.list = function(req, res) {

  db.Category.findAll({
    attributes: ['id','title'],
    order: [['title', 'ASC']]
  }).success(function(categories) {
    console.log('found categoes');
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(categories));
  }).error(function(err) {
    console.log('lost categoes');
    console.log(err);
  });

};

exports.listByArea = function (req, res) {

  var areaId = req.params.areaId;

  db.Category.findAll( {
    where: {
      areaId: {
        eq: areaId
      }
    },
    include: [
      { model: db.CategoryTarget} ],
    order: [['title', 'ASC']]
  }).success( function(categories) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(categories));

  }).error(function(err) {
    console.log(err);
  });
};

exports.byId = function( req, res) {

  var categoryId = req.params.id;

  db.Category.find({
    where: {
      id: {
        eq: categoryId
      }
    }

  }).success( function(category) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(category));
  }).error(function(err) {
    console.log(err);
  });

};

exports.add = function(req, res ) {

  var title = req.body.title;

  db.Category.create({
    title: title
  }).success(function(result) {
    console.log(result);
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify({status: 'success', id: result.id}));
  }).error(function(err) {
    console.log(err);
  });

};

exports.update = function(req, res) {

  console.log(req.body);
  var title = req.body.title;
  var url = req.body.url;
  var description = req.body.description;
  var linkLabel = req.body.linkLabel;
  var id = req.body.id;
  var areaId = req.body.areaId;
  console.log("Got id " + id);
  db.Category.update({
      title: title,
      url: url,
      linkLabel: linkLabel,
      description: description,
      areaId: areaId
    },
    {
      id: {
        eq: id
      }
    }).success(function() {
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify({status: 'success'}));
    }).error(function(err) {
      console.log(err);
    });

};

exports.delete = function(req, res) {

  var catId = req.body.id;

  db.Category.destroy({
    id: {
      eq: catId
    }
  }).success(function() {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify({ status: 'success', id: catId }));
  }).error(function(err) {
    console.log(err);
  });

};





exports.create = function(req, res) {

  var catName = req.body.title;
  var catUrl = req.body.url;
  var secondUrl = req.body.secondUrl;
  var catDesc = req.body.description;
  var areaId = req.body.area;
  // First create the new category. Then retrieve the
  // updated category list and pass it to the view.
  async.series (
    {
      create: function (callback) {
        db.Category.create({
          title: catName,
          url: catUrl,
          secondaryUrl: secondUrl,
          description: catDesc,
          areaId: areaId,
        }).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      home: function (callback) {
        db.Category.findAll(
          {
            attributes: ['id','title', 'url','secondaryUrl', 'description', 'areaId'],
            order: [['title', 'ASC']]
          }
        ).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      }
    },
    function(err, result) {
      if (err) { console.log(err); }
      res.render('categoryIndex', {
        title: 'Categories',
        categories: result.home
      });
    }
  );
};


exports.oldupdate = function(req, res) {

  var catName = req.body.title;
  var catUrl = req.body.url;
  var secondUrl = req.body.secondUrl;
  var catDesc = req.body.description;
  var catLink = req.body.linkLabel;
  var catId = req.body.id;
  var area = req.body.area;

  // First update the collection. Then retrieve the updated
  // collection list and pass it to the view.
  async.series (
    {
      update:  function (callback) {
        db.Category.update({
            title: catName,
            url: catUrl,
            linkLabel: catLink,
            secondaryUrl: secondUrl,
            description: catDesc,
            areaId: area,
          },
          {
            id: {
              eq: catId
            }
          }).complete(callback);
      },
      home: function (callback) {
        db.Category.findAll(
          {
            attributes: ['id','title', 'url','linkLabel', 'secondaryUrl', 'description', 'areaId'],
            order: [['title', 'ASC']]
          }
        ).complete(callback);
      }
    },
    function(err, result) {
      if (err) { console.log(err); }
      res.render('categoryIndex', {
        title: 'Categories',
        categories: result.home
      });
    }
  );
};



exports.olddelete = function(req, res) {

  var catId = req.params.id;
  // First delete the collection. Then retrieve the updated
  // collection list and pass it to the view.
  async.series (
    {
      delete: function(callback) {
        db.Category.destroy({
          id: {
            eq: catId
          }
        }).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      home: function(callback) {
        db.Category.findAll(
          {
            attributes: ['id','title', 'url', 'secondaryUrl', 'description', 'areaId'],
            order: [['title', 'ASC']]
          }
        ).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      }
    }, function(err, result) {
      if (err) { console.log(err); }
      res.render('categoryIndex', {
        title: 'Categories',
        categories: result.home
      });
    }
  );
};

exports.addCategoryTarget = function (req, res) {

  var catId = req.body.catId;
  var collId = req.body.collId;

  async.series (
    {
      dropCategoryTarget: function(callback) {
        db.CategoryTarget.destroy({
          CollectionId: {
            eq: collId
          }
        }).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      addCategoryTarget: function(callback) {
        db.CategoryTarget.create({
          CollectionId: collId,
          CategoryId: catId
        }).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      }

    },
    /*jshint unused:false */
    function(err, result) {
      if (err) { console.log(err); }
      res.redirect('/admin/form/collection/update/' + collId);
    });


};







