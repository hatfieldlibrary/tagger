'use strict;'

var async = require('async');

exports.getAreaTargets = function(req, res ) {

  var TagId = req.params.tagId;

  db.TagAreaTarget.findAll(
    {
      where: {
        TagId: {
          eq: TagId
        }
      }
    },
    {attributes: ['AreaId']}
  ).success(function(areas) {
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify(areas));
    }).error(function(err) {
      console.log(err);
    });
};


exports.addTarget = function(req, res) {

  var tagId = req.params.tagId;
  var areaId = req.params.areaId;

  async.series(
    {
      // Check to see if tag is already associated
      // with area.
      check: function (callback) {

        db.TagAreaTarget.find(
          {
            where: {
              TagId: {
                eq: tagId
              },
              AreaId: {
                eq: areaId
              }
            }
          }).complete(callback)
          .error(function (err) {
            console.log(err);
          });
      }
    },
    function (err, result) {
      console.log('check ' + result.check);
      // if new
      if (result.check === null) {
         console.log('adding target');
         addArea(tagId, areaId, res);

      }
      // if not new, just return the current list.
      else {
        console.log('returning list');
        db.TagAreaTarget.findAll(
          {
            where: {
              TagId: {
                eq: tagId
              }
            }
          },
          {attributes: ['AreaId','TagId']}
        ).success(function (areas) {
          // JSON response
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({status: 'exists', areaTargets: areas}))
          }).error(function(err) {
            console.log(err);
          });
      }

    });
};

function addArea(tagId, areaId, res) {

      console.log('tag ' + tagId  +', area ' + areaId +  ' ,res ' + res);

  async.series(
    {
      create: function (callback) {
        db.TagAreaTarget.create(
          {
            TagId: tagId,
            AreaId: areaId
          }
        ).complete(callback)
          .error(function (err) {
            console.log(err);
          });

      },
      areaList: function (callback) {
        db.TagAreaTarget.findAll(
          {
            where: {
              TagId: {
                eq: tagId
              }
            }
          },
          {attributes: ['AreaId']}
        ).complete(callback)
          .error(function (err) {
            console.log(err);
          });
      }
    },

    function (err, result) {
      console.log(result);
      if (err) { console.log(err); }
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify({status: 'success', areaTargets: result.areaList}));

    }
  );
}

exports.removeTarget = function(req, res) {

  var tagId = req.params.tagId;
  var areaId = req.params.areaId;

  async.series (
    {
      create: function(callback) {
        db.TagAreaTarget.destroy(
          {
            TagId: {
              eq: tagId
            },
            AreaId: {
              eq: areaId
            }
          }
        ).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      areaList: function(callback) {
        db.TagAreaTarget.findAll(
          {
            where: {
              TagId: {
                eq: tagId
              }
            }
          },
          { attributes: ['AreaId'] }
        ).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      }
    },
    function(err, result) {
      if (err) { console.log(err); }
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify({status: 'success', areaTargets: result.areaList}));
    }

  );


};
