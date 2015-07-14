'use strict';

var async = require('async');


exports.create = function(req, res) {

  var title = req.body.title;
  var url = req.body.url;
  var searchUrl = req.body.searchUrl;
  var description = req.body.description;
  // First create the new category. Then retrieve the
  // updated category list and pass it to the view.
  async.series (
    {
      create: function (callback) {
        db.Area.create({
          title: title,
          url: url,
          searchUrl: searchUrl,
          description: description,
        }).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      home: function (callback) {
        db.Area.findAll(
          {
            attributes: ['id','title', 'url','searchUrl', 'description'],
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
      res.render('areaIndex', {
        title: 'Areas',
        areas: result.home
      });
    }
  );
};

exports.update = function(req, res) {

  var title = req.body.title;
  var url = req.body.url;
  var searchUrl = req.body.searchUrl;
  var description = req.body.description;
  var id = req.body.id;

  // First update the collection. Then retrieve the updated
  // collection list and pass it to the view.
  async.series (
    {
      update:  function (callback) {
        db.Area.update({
            title: title,
            url: url,
            searchUrl: searchUrl,
            description: description
          },
          {
            id: {
              eq: id
            }
          }).complete(callback);
      },
      home: function (callback) {
        db.Area.findAll(
          {
            attributes: ['id','title', 'url', 'searchUrl', 'description'],
            order: [['title', 'ASC']]
          }
        ).complete(callback);
      }
    },
    function(err, result) {
      if (err) { console.log(err); }
      res.render('areaIndex', {
        title: 'Areas',
        areas: result.home
      });
    }
  );
};


exports.delete = function(req, res) {

  var areaId = req.params.id;
  // First delete the collection. Then retrieve the updated
  // collection list and pass it to the view.
  async.series (
    {
      delete: function(callback) {
        db.Area.destroy({
          id: {
            eq: areaId
          }
        }).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      home: function(callback) {
        db.Area.findAll(
          {
            attributes: ['id','title', 'url', 'searchUrl', 'description'],
            order: [['title', 'ASC']]
          }
        ).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      }
    }, function(err, result) {
      if (err) { console.log(err); }
      res.render('areaIndex', {
        title: 'Areas',
        areas: result.home
      });
    }
  );
};
