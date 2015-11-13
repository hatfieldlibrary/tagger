'use strict';

var async = require('async');

exports.overview = function (req, res) {

  res.render('areaOverview', {
    title: 'Areas',
    user: req.user.displayName,
    picture: req.user._json.picture,
    areaId: req.user.areaId
  });
};

/**
 * Retrieves area information by area id.
 * @param req
 * @param res
 */
exports.byId = function (req, res) {

  var areaId = req.params.id;

  db.Area.find({
    where: {
      id: areaId
    },
    order: [['title', 'ASC']]
  }).then(function (tags) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify(tags));

  });
};

/**
 * Retrieves a list of all areas.
 * @param req
 * @param res
 */
exports.list = function (req, res) {

  db.Area.findAll({
    order: [['position', 'ASC']]
  }).then(function (tags) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify(tags));

  });
};

/**
 * Adds new area, setting the area position to the
 * end of the current area list.
 * @param req
 * @param res
 */
exports.add = function (req, res) {

  var title = req.body.title;

  db.Area.findAll()
    .then(function (result) {
      addArea(result.length + 1)
    })
    .error(function (err) {
      console.log(err);
    });

  function addArea(position) {
    db.Area.create({
      title: title,
      position: position
    }).then(function (result) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify({status: 'success'}));
    }).error(function (err) {
      console.log(err);
    });
  }

};

/**
 * Updates an existing area.
 * @param req
 * @param res
 */
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
    }).then(function (result) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify({status: 'then', id: result.id}));
  });
};

/**
 * Updates area position to new value based on the
 * order of the new array passed in via POST. The new position
 * can be used to order query results for clients (order by position).
 * @param req
 * @param res
 */
exports.reorder = function (req, res) {

  var areas = req.body.areas;
  var areaCount = areas.length();

  /**
   * Promise method that returns the count value if the
   * limit condition has not been reached, or the
   */
  var promiseFor = Promise.method(function (condition, action, value) {
    if (!condition(value)) return value;
    return action(value).then(promiseFor.bind(null, condition, action));
  });

  promiseFor(function (count) {
      // Test for limit (condition)
      return count < areaCount;
    },
    // Do update (action)
    function (count) {
      return db.Area.update(
        {
          // position attribute based on current array index
          position: i + 1
        },
        {
          id: areas[i].id
        })
        .then(function (res) {
          // Return the incremented count value
          return ++count;
        });
    },
    // initialize count value
    0).then(
    // called Promise method after limit is reached.
    function () {
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify({status: 'success'}))
    })
    .error(function (err) {
      console.log(err);
    });


};

/**
 * Delete an area.
 * @param req
 * @param res
 */
exports.delete = function (req, res) {

  var id = req.body.id;

  db.Area.destroy({
    id: {
      eq: id
    }
  }).then(function (result) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify({status: 'success'}));
  });
};

