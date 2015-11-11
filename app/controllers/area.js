'use strict';

var async = require('async');

exports.overview = function(req, res) {

  res.render('areaOverview', {
    title: 'Areas',
    user: req.user.displayName,
    picture: req.user._json.picture,
    areaId: req.user.areaId
  });
};

exports.byId = function(req, res) {

  var areaId = req.params.id;

  db.Area.find( {
    where: {
      id: areaId
    },
    order: [['title', 'ASC']]
  }).then( function(tags) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(tags));

  });
};

exports.list = function(req, res) {

  db.Area.findAll( {
    order: [['position', 'ASC']]
  }).then( function(tags) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(tags));

  });
};

exports.add =function (req, res) {

  var title = req.body.title;

  db.Area.findAll()
    .then(function(result) {
      addArea(result.length + 1)
    })
    .error(function (err) {
      console.log(err);
    });

  function addArea(position) {
    db.Area.create({
      title: title,
      position: position
    }).then(function(result) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify({ status: 'success' }));
    }).error(function(err) {
      console.log(err);
    });
  }

};

exports.update = function (req, res) {
  var title = req.body.title;
  var url = req.body.url;
  var searchUrl = req.body.searchUrl;
  var description = req.body.description;
  var linkLabel = req.body.linkLabel;
  var id = req.body.id;

  db.Area.update({
      title: title,
      url: url,
      linkLabel: linkLabel,
      searchUrl: searchUrl,
      description: description
    },
    {
      id: {
        eq: id
      }
    }).then(function(result) {
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify({ status: 'then', id: result.id }));
    });
};

/**
 * Updates position attributes to new values based on the
 * order of the array passed in via POST.  This is useful
 * when the array order has been changed in the client-side
 * model. The new position value can be used to order query
 * results for clients (order by position).
 * @param req
 * @param res
 */
exports.reorder = function (req, res) {

  var areas = req.body.areas;

  var chainer = new db.Sequelize.Utils.QueryChainer();
  for (var i = 0; i < areas.length; i++) {
    chainer.add(
      db.Area.update(
        {
          // position attribute based on current array index
          position: i + 1
        },
        {
          id: areas[i].id
        })
    );
  }

  chainer.run()
    .then(function() {
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify({ status: 'success'}))
    }).error(function(err) {
      console.log(err);
    })

};

exports.delete = function (req , res) {

  var id = req.body.id;

  db.Area.destroy({
    id: {
      eq: id
    }
  }).then(function(result) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify({ status: 'success'}));
  });
};

