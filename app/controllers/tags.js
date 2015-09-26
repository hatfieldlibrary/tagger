'use strict';

/**
 * Created by mspalti on 5/23/14.
 */

var async = require('async');


exports.overview = function(req, res) {

  res.render('tagOverview', {
    title: 'Tags',
    user: req.user.displayName,
    picture: req.user._json.picture,
    areaId: req.user.areaId
  });
};

exports.list = function (req, res) {

  db.Tag.findAll({

    order: [['name', 'ASC']]

  }).success(function (tags) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify(tags));

  }).error(function(err) {
    console.log(err);
  });

};

exports.byId = function(req, res) {

  var id = req.params.id;

  db.Tag.find( {
    where: {
      id: {
        eq: id
      }
    },
    order: [['name', 'ASC']]
  }).success( function(tag) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(tag));

  }).error(function(err) {
    console.log(err);
  });
};

// Provides list of tags associated with and area.
exports.tagByArea = function (req, res) {
  var areaId = req.params.areaId;
  db.TagAreaTarget.findAll( {
    where: {
      AreaId: {
        eq: areaId
      }
    },

   // attributes: ['name', 'TagId'],
    order: [['name', 'ASC']],
    include: [db.Tag]
  }).success( function(tags) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(tags));
  }).error(function(err) {
    console.log(err);
  });
};


exports.add = function( req, res) {

  var name = req.body.name;

  async.parallel (
    {
      // Check to see if content type already exists.
      check: function (callback) {
        console.log('checking existence of content type');
        db.Tag.find(
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
        db.Tag.create({name: name
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

exports.update = function (req, res) {

  var id = req.body.id;
  var name = req.body.name;

  db.Tag.update(
    {
      name: name
    },
    {
      id: {
        eq: id
      }
    }).success(function() {
      console.log('success');
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify({status: 'success'}))
    }).error(function(err) {
      console.log(err);
    });
};

exports.delete = function (req , res) {

  var id = req.body.id;

  db.Tag.destroy({
    id: {
      eq: id
    }
  }).success(function() {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify({ status: 'success'}));
  });
};










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
          }).success(function () {
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

exports.olddelete = function (req, res) {

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

