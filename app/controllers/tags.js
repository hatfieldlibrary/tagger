'use strict';

/**
 * Created by mspalti on 5/23/14.
 */

var async = require('async');

exports.create = function(req, res) {

  var tagName = req.body.name;
  var tagUrl = req.body.url;
  var areaId = req.body.areaId;


  // async not really required here
  async.parallel (
    {
      check: function (callback) {
        db.Tag.find(
          {
            where: {
              name: {
                eq: tagName
              },
              areaId: {
                eq: areaId
              }
            }
          }
        ).complete(callback)
          .error(function (err) {
            console.log(err);
          });
      },
      areas: function (callback) {
        db.Area.findAll({
          attributes: ['id', 'title']
        }).complete(callback)
          .error(function (err) {
            console.log(err);
          });
      }
    },
    function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result.check === null) {
        console.log('creating tag');
        db.Tag.create(
          {
            name: tagName,
            url: tagUrl,
            areaId: areaId
            /*jshint unused:false*/
          }).success(function (items) {
            db.Tag.findAll()
              .success(function (tags) {
                res.render('tagIndex', {
                  title: 'Tags',
                  tags: tags,
                  areas: result.areas,
                  exists: false

                });
              }).error(function (err) {
                console.log(err);
              });
          })
          .error(function (err) {
            console.log(err);
          });
      } else {
        db.Tag.findAll()
          .success(function (tags) {
            res.render('tagIndex', {
              title: 'Tags',
              tags: tags,
              areas: result.areas,
              exists: true
            });
          }).error(function (err) {
            console.log(err);
          });
      }

    }

  );
};


exports.getTagInfo = function(req, res) {

  var tagId = req.params.id;
  db.Tag.find({
    where: {
      id: {
        eq: tagId

      }
    }
  }).success(function(result) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    // if query yields null result return this in response
    if (result !== null) {
      res.end(JSON.stringify(result.getContentObject));
    } else {
      res.end(JSON.stringify(result));
    }
  }).error(function(err) {
    console.log(err);
  });

};


exports.tagUpdate = function (req, res) {

  var tagId = req.body.id;
  var tagName = req.body.name;
  var tagUrl = req.body.url;
  var areaId = req.body.areaId;
  async.series (
    {
      update: function (callback) {
        db.Tag.update(
          {
            name: tagName,
            url: tagUrl,
            areaId: areaId
          },
          {
            id: {
              eq: tagId
            }
          }).complete(callback);
      },
      tags: function(callback) {
        db.Tag.findAll(
          {
            order: [['name', 'ASC']]
          }
        ).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      areas: function (callback) {
        db.Area.findAll({
          attributes: ['id', 'title']
        }).complete(callback)
          .error(function (err) {
            console.log(err);
          });
      }
    },
    function (err, result) {
      res.render('tagIndex', {
        title: 'Tags',
        tags: result.tags,
        areas: result.areas
      });
    }
  );
};

exports.delete = function (req, res) {

  var tagId = req.params.id;
  async.series (
    {
      delete: function(callback)  {
        db.Tag.destroy(
          {
            id: {
              eq: tagId
            }
          }
        ).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      home: function(callback) {
        db.Tag.findAll(
          {
            order: [
              ['name', 'ASC']
            ]
          }
        ).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      }
    },
    function (err, result) {
      res.render('tagIndex', {
        title: 'Tags',
        tags: result.home
      });
    }
  );
};

exports.getSubjects = function(req, res) {

  db.Tag.findAll(
    {
      where: 'type = \'sub\'',
      order: 'name ASC'
    }
  )
    .success(function(result) {

      var arr = [];
      for  (var i = 0; i < result.length; i++) {
        var tmp =  result[i].getContentObject;
        arr[i] = { label: tmp.name, value : tmp.name, id: tmp.id, url: tmp.url };
      }
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify(arr));

    }).error(function(err) {
      console.log(err);
    });

};

exports.tagList = function(req, res) {

  db.Tag.findAll()
    .success(function(result) {

      var arr = [];
      for  (var i = 0; i < result.length; i++) {
        var tmp =  result[i].getContentObject;
        arr[i] = { label: tmp.name, value : tmp.name, id: tmp.id, url: tmp.url };
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(arr));
    }).error(function(err) {
      console.log(err);
    });

};

exports.subjectsByArea = function(req, res) {

  var areaId = req.params.id;

  db.Tag.findAll( {
    where: {
      areaId: {
        eq: areaId
      }
    },
    attributes: ['id','name'],
    order: [['name', 'ASC']]
  }).success( function(tags) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(tags));

  });
};

