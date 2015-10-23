'use strict';
/**
 * Created by mspalti on 8/1/14.
 */

var async = require('async');

exports.overview = function(req, res) {

  res.render('contentOverview', {
    title: 'Categories',
    user: req.user.displayName,
    picture: req.user._json.picture,
    areaId: req.user.areaId
  });
};

exports.byId = function( req, res) {

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

exports.list = function(req, res) {

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

exports.countByArea = function(req, res) {

  var areaId = req.params.areaId;

  db.sequelize.query('Select name, COUNT(*) as count from AreaTargets left ' +
    'join Collections on AreaTargets.CollectionId = Collections.id left join ItemContentTargets ' +
    'on ItemContentTargets.CollectionId = Collections.id left join ItemContents on ' +
    'ItemContentTargets.ItemContentId = ItemContents.id ' +
    'where AreaTargets.AreaId = ' + areaId + ' group by ItemContents.id order by ' +
    'count DESC').then(function(types) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(types));
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

exports.update = function (req, res) {

  var id = req.body.id;
  var name = req.body.name;
  var icon = req.body.icon;

  db.ItemContent.update(
    {
      name: name,
      icon: icon
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

