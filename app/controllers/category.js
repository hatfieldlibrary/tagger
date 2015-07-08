'use strict';

var async = require('async');


exports.create = function(req, res) {

  var catName = req.body.title;
  var catUrl = req.body.url;
  var catDesc = req.body.description;
  // First create the new collection. Then retrieve the
  // updated collection list and pass it to the view.
  async.series (
    {
      create: function (callback) {
        db.Category.create({
          title: catName,
          url: catUrl,
          description: catDesc,
        }).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      home: function (callback) {
        db.Category.findAll(
          {
            attributes: ['id','title', 'url', 'description'],
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
            attributes: ['id','title', 'url', 'description'],
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
            attributes: ['id','title', 'url', 'description'],
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
