'use strict';

var async = require('async');

exports.overview = function(req, res) {
  console.log(req.user);
  res.render('categoryOverview', {
    title: 'Categories',
    user: req.user.displayName,
    picture: req.user._json.picture,
    areaId: req.user.areaId
  });
};

exports.list = function(req, res) {

  db.Category.findAll({
    attributes: ['id','title'],
    order: [['title', 'ASC']]
  }).success(function(categories) {

    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(categories));
  }).error(function(err) {
    console.log('lost categoes');
    console.log(err);
  });

};

exports.categoryCountByArea = function(req, res) {

  var areaId = req.params.areaId;

  db.sequelize.query('select Categories.title, COUNT(*) as count from AreaTargets left join ' +
    'Collections on AreaTargets.CollectionId = Collections.id left join CategoryTargets on ' +
    'CategoryTargets.CollectionId = Collections.id left join Categories on CategoryTargets.CategoryId = Categories.id ' +
    'where AreaTargets.AreaId = ' + areaId + ' group by Categories.id order by count DESC;'
  ).then(function(categories) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify(categories));
    });

};

exports.listByArea = function (req, res) {

  var areaId = req.params.areaId;

  db.Category.findAll( {
    where: {
      areaId: {
        eq: areaId
      }
    },
    order: [['title', 'ASC']]
  }).success( function(categories) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(categories));

  }).error(function(err) {
    console.log(err);
  });
};

exports.byId = function( req, res) {

  var categoryId = req.params.id;

  db.Category.find({
    where: {
      id: {
        eq: categoryId
      }
    }

  }).success( function(category) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(category));
  }).error(function(err) {
    console.log(err);
  });

};

exports.add = function(req, res ) {

  var title = req.body.title;

  db.Category.create({
    title: title
  }).success(function(result) {
    console.log(result);
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify({status: 'success', id: result.id}));
  }).error(function(err) {
    console.log(err);
  });

};

exports.update = function(req, res) {

  var title = req.body.title;
  var url = req.body.url;
  var description = req.body.description;
  var linkLabel = req.body.linkLabel;
  var id = req.body.id;
  var areaId = req.body.areaId;
  console.log("Got id " + id);
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







