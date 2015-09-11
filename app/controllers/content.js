'use strict';
/**
 * Created by mspalti on 8/1/14.
 */

var async = require('async');

exports.getOverview = function(req, res) {

  res.render('contentOverview', {
    title: 'Categories',
    user: req.user.displayName,
    picture: req.user._json.picture
  });
};

exports.add = function( req, res) {

  var name = req.body.title;

  async.parallel (
    {
      // Check to see if content type already exists.
      check: function (callback) {
        console.log('checking existence of content type');
        db.ItemContent.find(
          {
            where: {
              name: {
                eq: name
              }
            }
          }
        ).complete(callback)
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
        // Add new content type
        db.ItemContent.create({name: name
        }).success(function (result) {
          // JSON response
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin','*');
          res.end(JSON.stringify({status: 'success', id: result.id}));
        })
          .error(function (err) {
            console.log(err);
          });

      } else {
        // JSON response
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin','*');
        res.end(JSON.stringify({status: 'failure'}));

      }
    }

  );
};

exports.getTypeById = function( req, res) {

  var id = req.params.id;

  db.ItemContent.find({
    where: {
      id: {
        eq: id
      }
    }

  }).success( function(type) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(type));
  }).error(function(err) {
    console.log(err);
  });

};

exports.listTypes = function(req, res) {

  db.ItemContent.findAll({
    attributes: ['id','name'],
    order: [['name', 'ASC']]
  }).success(function(types) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(types));
  }).error(function(err) {
    console.log(err);
  });

};


exports.create = function(req, res) {

  var cName = req.body.name;

  // async not really required here
  async.parallel (
    {
      check: function (callback) {
        db.ItemContent.find(
          {
            where: {
              name: {
                eq: cName
              }
            }
          }
        ).complete(callback)
          .error(function (err) {
            console.log(err);
          });
      }
    }, function (err, result) {
      if (err) { console.log(err);  }
      if (result.check === null) {
        db.ItemContent.create(
          {
            name: cName
            /*jshint unused:false*/
          }).success(function (items) {
            db.ItemContent.findAll()
              .success(function (ctypes) {
                res.render('contentIndex', {
                  title: 'Content Types',
                  tags: ctypes,
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
        db.ItemContent.findAll()
          .success(function (ctypes) {
            res.render('contentIndex', {
              title: 'Content Types',
              tags: ctypes,
              exists: true
            });
          }).error(function (err) {
            console.log(err);
          });
      }

    }

  );
};

exports.contentUpdate = function (req, res) {

  var contentId = req.body.id;
  var contentName = req.body.name;
  async.series (
    {
      update: function (callback) {
        db.ItemContent.update(
          {
            name: contentName
          },
          {
            id: {
              eq: contentId
            }
          }).complete(callback);
      },
      ctypes: function(callback) {
        db.ItemContent.findAll(
          {
            order: [['name', 'ASC']]
          }
        ).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      }
    },
    function (err, result) {
      res.render('contentIndex', {
        title: 'Content Types',
        tags: result.ctypes
      });
    }
  );
};

exports.delete = function (req, res) {

  var contentId = req.body.id;

  db.ItemContent.destroy(
    {
      id: {
        eq: contentId
      }
    }).success(function() {
        // JSON response
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin','*');
        res.end(JSON.stringify({status: 'success'}));

      }).
      error(function(err) {
          console.log(err);
      });

};

exports.olddelete = function (req, res) {

  var contentId = req.params.id;
  async.series (
    {
      delete: function(callback)  {
        db.ItemContent.destroy(
          {
            id: {
              eq: contentId
            }
          }
        ).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      home: function(callback) {
        db.ItemContent.findAll(
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
      res.render('contentIndex', {
        title: 'Content Types',
        tags: result.home
      });
    }
  );
};

exports.getTypeList = function(req, res) {

  db.ItemContent.findAll()
    .success(function(result) {
      var arr = [];
      for  (var i = 0; i < result.length; i++) {
        var tmp =  result[i].getContentObject;
        arr[i] = { label: tmp.name, value : tmp.name, id: tmp.id};
      }
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify(arr));
    }).error(function(err) {
      console.log(err);
    });

};

exports.getTypeInfo = function(req, res) {

  var typeId = req.params.id;
  db.ItemContent.find({
    where: {
      id: {
        eq: typeId
      }
    }
  }).success(function(result) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    if (result !== null) {
      res.end(JSON.stringify(result.getContentObject));
    } else {
      res.end(JSON.stringify(result));
    }
  }).error(function(err) {
    console.log(err);
  });

};
