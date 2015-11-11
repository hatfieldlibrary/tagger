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

  }).then(function (tags) {
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
      id:  id
    },
    order: [['name', 'ASC']]
  }).then( function(tag) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(tag));

  }).error(function(err) {
    console.log(err);
  });
};

// Provides list of tags associated with an area.
exports.tagByArea = function (req, res) {


  var areaId = req.params.areaId;

  db.TagAreaTarget.findAll( {
    where: {
      AreaId: areaId
    },

    attributes: [[db.Tag, 'name'], ['TagId']],
    order: [db.Tag, ['name', 'ASC']],
    include: [db.Tag]
  }).then( function(tags) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(tags));
  }).error(function(err) {
    console.log(err);
  });
};

exports.tagByAreaCount = function (req, res) {
  var areaId = req.params.areaId;

  db.sequelize.query('SELECT name, COUNT(*) as count from TagTargets left join Tags on ' +
    'TagTargets.TagId = Tags.id left join TagAreaTargets on TagAreaTargets.TagId = Tags.id  ' +
    'WHERE TagAreaTargets.AreaId = ' + areaId + ' group by TagTargets.TagId order by Tags.name'
  ).then(function (tags) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
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
        db.Tag.find(
          {
            where: {
              name: name
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
        }).then(function (result) {
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
    }).then(function() {
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
    id: id
  }).then(function() {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify({ status: 'success'}));
  });
};

// end admin

exports.subjectsByArea = function(req, res) {

  console.log('subjectsByArea');
  var id = req.params.id;
  db.TagAreaTarget.findAll( {
    where: {
      AreaId: id
    },
    include: [db.Tag],
    attributes: ['"Tags.name"', 'TagId'],
    order: [[db.Tag, 'name', 'ASC']]

  }).then( function(tags) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(tags));
  }).error(function(err) {
    console.log(err);
  });
};

