'use strict';

var async = require('async');


/**
 * Retrieves the list of all collection groups.
 * @param req
 * @param res
 */
exports.list = function(req, res) {

  db.Category.findAll({
    attributes: ['id','title'],
    order: [['title', 'ASC']]
  }).then(function(categories) {

    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(categories));
  }).error(function(err) {
    console.log(err);
  });

};

/**
 * Returns collection group title and usage count for dashboard.
 * @param req
 * @param res
 */
exports.categoryCountByArea = function(req, res) {

  var areaId = req.params.areaId;

  db.sequelize.query('select Categories.title, COUNT(*) as count from AreaTargets left join ' +
    'Collections on AreaTargets.CollectionId = Collections.id left join CategoryTargets on ' +
    'CategoryTargets.CollectionId = Collections.id left join Categories on CategoryTargets.CategoryId = Categories.id ' +
    'where AreaTargets.AreaId = ? group by Categories.id order by count DESC;',
    {
      replacements: [areaId],
      type: db.Sequelize.QueryTypes.SELECT
    }
  ).then(function(categories) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify(categories));
    });

};

/**
 * Retrieves list of collection groups by area.
 * @param req
 * @param res
 */
exports.listByArea = function (req, res) {

  var areaId = req.params.areaId;

  db.Category.findAll( {
    where: {
      areaId: areaId
    },
    order: [['title', 'ASC']]
  }).then( function(categories) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(categories));

  }).error(function(err) {
    console.log(err);
  });
};

/**
 * Retrieves single collection group information by category id.
 * @param req
 * @param res
 */
exports.byId = function( req, res) {

  var categoryId = req.params.id;

  db.Category.find({
    where: {
      id:  categoryId
    }

  }).then( function(category) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(category));
  }).error(function(err) {
    console.log(err);
  });

};

/**
 * Adds a new collection group with title.
 * @param req
 * @param res
 */
exports.add = function(req, res ) {

  var title = req.body.title;

  db.Category.create({
    title: title
  }).then(function(result) {
    console.log(result);
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify({status: 'success', id: result.id}));
  }).error(function(err) {
    console.log(err);
  });

};

/**
 * Updates collection group.
 * @param req
 * @param res
 */
exports.update = function(req, res) {

  var title = req.body.title;
  var url = req.body.url;
  var description = req.body.description;
  var linkLabel = req.body.linkLabel;
  var id = req.body.id;
  var areaId = req.body.areaId;
  db.Category.update({
      title: title,
      url: url,
      linkLabel: linkLabel,
      description: description,
      areaId: areaId
    },
    {
      id: {
        eq: id
      }
    }).success(function() {
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify({status: 'success'}));
    }).error(function(err) {
      console.log(err);
    });

};

/**
 * Deletes collection group.
 * @param req
 * @param res
 */
exports.delete = function(req, res) {

  var catId = req.body.id;

  db.Category.destroy({
    id: {
      eq: catId
    }
  }).success(function() {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify({ status: 'success', id: catId }));
  }).error(function(err) {
    console.log(err);
  });

};







