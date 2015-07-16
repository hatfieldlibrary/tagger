'use strict';

var async = require('async');


exports.create = function(req, res) {

  var catName = req.body.title;
  var catUrl = req.body.url;
  var secondUrl = req.body.secondUrl;
  var catDesc = req.body.description;
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
        }).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      home: function (callback) {
        db.Category.findAll(
          {
            attributes: ['id','title', 'url','secondaryUrl', 'description'],
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

exports.update = function(req, res) {

  var catName = req.body.title;
  var catUrl = req.body.url;
  var secondUrl = req.body.secondUrl;
  var catDesc = req.body.description;
  var catId = req.body.id;

  // First update the collection. Then retrieve the updated
  // collection list and pass it to the view.
  async.series (
    {
      update:  function (callback) {
        db.Category.update({
            title: catName,
            url: catUrl,
            secondaryUrl: secondUrl,
            description: catDesc,
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
            attributes: ['id','title', 'url', 'secondaryUrl', 'description'],
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


exports.delete = function(req, res) {

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
            attributes: ['id','title', 'url', 'secondaryUrl', 'description'],
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
