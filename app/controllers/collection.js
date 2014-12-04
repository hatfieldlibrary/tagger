'use strict';

var
  async = require('async');



var processCollectionResult = function(coll, res) {

  var count = coll.count;
  var collList = [],
    chainer = new db.Sequelize.Utils.QueryChainer();

  // chain queries to retrieve other tags associated with each collection
  coll.rows.forEach(function(entry) {

    var tmpColl = entry.collection.getCollectionObject;
    var collId = entry.CollectionId;
    var temp = {};
    chainer.add(
      db.TagTarget.findAll({
        where: {
          CollectionId: {
            eq: collId
          }
        },
        order: [['name', 'ASC']],
        include: [db.Tag]
      }).success(function(tags) {
        temp.id = tmpColl.id;
        temp.name = tmpColl.title;
        temp.description = tmpColl.desc;
        temp.url = tmpColl.url;
        temp.browseType = tmpColl.browseType;
        temp.image = tmpColl.image;
        temp.dates = tmpColl.dates;
        temp.items = tmpColl.items;
        temp.collType = tmpColl.ctype;
        temp.tags = tags;
      }).error(function(err) {
        console.log(err);
      })
    );
    chainer.add(
      db.ItemContentTarget.findAll({
        where: {
          CollectionId: {
            eq: collId
          }
        },
        order: [['name', 'ASC']],
        include: [db.ItemContent]

      }).success(function(media) {
        temp.itemTypes = media;
        collList.push(temp );
      }).error(function(err) {
        console.log(err);
      })
    );
  });
  chainer.run()
    .success(function() {
      console.log(collList);
      var result = [];
      result[0] = count;
      result[1] = collList;
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify(result));

    })
    .error(function(err) {
      console.log(err);
    });
};



exports.collectionById = function(req, res) {

  var collId = req.params.id;

  db.Collection.find( {
    where: {
      id: {
        eq: collId
      }
    },
    include: [db.TagTarget]
  }).success( function(coll) {
    processCollectionResult(coll, res);

  });
};

exports.collectionByTagId = function(req, res) {

  var tagId = req.params.id;
  // retrieve collections with matching TagId
  db.TagTarget.findAndCountAll({
    where:
    {
      TagId: {
        eq: tagId
      }
    },
    order: [['title', 'ASC']],
    include: [db.Collection]

  }).success( function(coll) {
    processCollectionResult(coll, res);

  }).error(function(err) {
    console.log(err);
  });

};

exports.collectionByTypeId = function (req, res) {

  var typeId = req.params.id;
  db.ItemContentTarget.findAndCountAll({
    where: {
      ItemContentId: {
        eq: typeId
      }
    },

    include: [db.Collection]
  }).success (function(coll) {
    processCollectionResult(coll,res);
  }).error(function(err){
    console.log(err);
  });

};

// Returns a JSON representation of the DSpace API communities
// response.
exports.getDspaceCollections = function (req, res ) {

  var http = require('http');

  var options = {
    headers: {
      accept: 'application/json'
    },
    host: 'dspace.willamette.edu',
    port: 8080,
    path: '/rest/communities',
    method: 'GET'
  };
  var callback = function(response) {
    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });
    response.on('end', function() {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(str);
    });
  };
  var request = http.request(options, callback);
  request.on('error', function (e) {
    console.log('Problem with request: ' + e);
  });
  request.end();

};


// This is not currently in use.  The fuction returns
// a JSON representation fo the contentdm api response.
exports.getEadBySubject = function(req, res) {

  var http = require('http');
  var field = req.params.fld;
  var sub = req.params.id;

  var options = {
    host:  'condm.willamette.edu',
    port:  '81',
    path:  '/dmwebservices/index.php?q=dmQuery/eads/' + field + '^' + sub + '^exact^and!/descri!bdate!title!creato/nosort/75/1/1/0/0/geogra!bdate!/json',
    method: 'GET'
  };

  var callback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      var json = JSON.parse(str);
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify(json.records));
    });
  };

  var request = http.request(options, callback);
  request.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  request.end();
};


exports.create = function(req, res) {

  var collName = req.body.name;
  var collUrl = req.body.url;
  var collBrowseType = req.body.browseType;
  var collDesc = req.body.description;
  var collDates = req.body.dates;
  var collItems = req.body.items;
  var collType = req.body.ctype;
  // First create the new collection. Then retrieve the
  // updated collection list and pass it to the view.
  async.series (
    {
      create: function (callback) {
        db.Collection.create({
          title: collName,
          url: collUrl,
          browseType: collBrowseType,
          description: collDesc,
          dates: collDates,
          items: collItems,
          ctype: collType
        }).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      home: function (callback) {
        db.Collection.findAll(
          {
            attributes: ['id','title', 'url', 'description'],
            order: [['title', 'ASC']]
          }
        ).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      }
    },
    function(err, result) {
      if (err) { console.log(err); }
      res.render('index', {
        title: 'Collections',
        collections: result.home
      });
    }
  );
};

exports.update = function(req, res) {

  var collName = req.body.name;
  var collUrl = req.body.url;
  var collBrowseType = req.body.browseType;
  var collDesc = req.body.description;
  var collId = req.body.id;
  var collDates = req.body.dates;
  var collItems = req.body.items;
  var collType = req.body.ctype;

  // First update the collection. Then retrieve the updated
  // collection list and pass it to the view.
  async.series (
    {
      update:  function (callback) {
        db.Collection.update({
            title: collName,
            url: collUrl,
            browseType: collBrowseType,
            description: collDesc,
            dates: collDates,
            items: collItems,
            ctype: collType
          },
          {
            id: {
              eq: collId
            }
          }).complete(callback);
      },
      home: function (callback) {
        db.Collection.findAll(
          {
            attributes: ['id','title', 'url', 'description'],
            order: [['title', 'ASC']]
          }
        ).complete(callback);
      }
    },
    function(err, result) {
      if (err) { console.log(err); }
      res.render('index', {
        title: 'Collections',
        collections: result.home
      });
    }
  );
};


exports.delete = function(req, res) {

  var collId = req.params.id;
  // First delete the collection. Then retrieve the updated
  // collection list and pass it to the view.
  async.series (
    {
      delete: function(callback) {
        db.Collection.destroy({
          id: {
            eq: collId
          }
        }).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      home: function(callback) {
        db.Collection.findAll(
          {
            attributes: ['id','title', 'url', 'description'],
            order: [['title', 'ASC']]
          }
        ).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      }
    }, function(err, result) {
      if (err) { console.log(err); }
      res.render('index', {
        title: 'Collections',
        collections: result.home
      });
    }
  );
};


exports.updateImage = function (req, res, config) {

  // paths for imagemagick and image dirctory
  var convert = config.convert,
    identify = config.identify,
    imagePath = config.taggerImageDir;

  var fs = require('fs'),
    multiparty = require('multiparty'),
    magick = require('imagemagick');


  magick.identify.path = identify;
  magick.convert.path = convert;


  var form = new multiparty.Form();
  var imageName;
  var id;
  form.parse(req, function (err, fields, files) {

    console.log(files.image);

    // read in the temp file from the upload
    fs.readFile(files.image[0].path, function (err, data) {

      imageName = files.image[0].originalFilename;
      id = fields.id;
      console.log(imageName);
      if (!imageName) {
        console.log('Image name not defined');
        res.redirect('/');
        res.end();

      } else {
        // use imagemagick to transform the full image to thumbnail.
        // write to thumb directory
        var fullPath = imagePath + '/full/' + imageName;
        var thumbPath = imagePath + '/thumb/' + imageName;
        console.log(fullPath);

        fs.writeFile(fullPath, data, function (err) {
          if (err) {
            console.log(err);
            res.redirect('/admin');
          }
          else {
            console.log('ImageMagick at work');
            magick.resize({
              srcPath: fullPath,
              dstPath: thumbPath,
              width:   200

            },
              /*jshint unused:false */
              function(err, stdout, stderr){
              if (err) { console.log(err); }
              // update database even if the conversion fails
              updateDb(id);
            });
          }
        });
      }
    });
  });

  function updateDb(id) {
    db.Collection.update({
        image: imageName
      },
      {
        id: {
          eq: id
        }
      }
      /*jshint unused:false*/
    ).success(function(err, result) {
        res.redirect('/admin/form/collection/update/'+id);
      }
    ).error(function(err) {
        console.log(err);
      }
    );

  }
};

exports.addTag = function(req, res) {

  var tagId = req.body.tagid;
  var collId = req.body.collid;
  // only add tag if not already attached to the collection
  db.TagTarget.find(
    {
      where: {
        CollectionId: {
          eq: collId
        },
        TagId: {
          eq: tagId
        }
      }
    }
  ).success(function(result)
    {
      console.log(result);
      if (result === null) {
        db.TagTarget.create({
          CollectionId: collId,
          TagId: tagId
          /*jshint unused:false*/
        }).success(function (result) {
            res.redirect('/admin/form/collection/update/' + collId);
          }
        ).error(function(err) {
            console.log(err);
          }
        );
      }
      else {
        res.redirect('/admin/form/collection/update/' + collId);
      }
    }
  ).error(function(err) {
      console.log(err);
    }
  );
};

exports.removeTag = function(req, res) {
  var collId = req.params.collid;
  var tagId = req.params.tagid;
  db.TagTarget.destroy({
    CollectionId: {
      eq: collId
    },
    TagId: {
      eq: tagId
    }
    /*jshint unused:false*/
  }).success(function(result) {
    res.redirect('/admin/form/collection/update/'+collId);
  }).error(function(err) {
    console.log(err);
  });
};

exports.addType = function(req, res) {

  var typeId = req.body.typeid;
  var collId = req.body.collid;
  // only add tag if not already attached to the collection
  db.ItemContentTarget.find(
    {
      where: {
        CollectionId: {
          eq: collId
        },
        ItemContentId: {
          eq: typeId
        }
      }
    }
  ).success(function(result)
    {
      console.log(result);
      if (result === null) {
        db.ItemContentTarget.create({
          CollectionId: collId,
          ItemContentId: typeId
          /*jshint unused:false*/
        }).success(function (result) {
            res.redirect('/admin/form/collection/update/' + collId);
          }
        ).error(function(err) {
            console.log(err);
          }
        );
      }
      else {
        res.redirect('/admin/form/collection/update/' + collId);
      }
    }
  ).error(function(err) {
      console.log(err);
    }
  );
};

exports.removeTag = function(req, res) {
  var collId = req.params.collid;
  var tagId = req.params.tagid;
  db.TagTarget.destroy({
    CollectionId: {
      eq: collId
    },
    TagId: {
      eq: tagId
    }
    /*jshint unused:false*/
  }).success(function(result) {
    res.redirect('/admin/form/collection/update/'+collId);
  }).error(function(err) {
    console.log(err);
  });
};

exports.browseList = function(req, res) {

  var http = require('http');
  //var collection = req.params.collection;

  var options = {
    headers: {
      accept: 'application/json'
    },
    // since this Node app is already serving as proxy, there
    // is no need to proxy again through libmedia
    host: 'exist.willamette.edu',
    port: 8080,
    path: '/exist/apps/METSALTO/api/BrowseList.xquery',
    method: 'GET'
  };
  var callback = function(response) {

    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });
    response.on('end', function() {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(str);
    });
  };
  var request = http.request(options, callback);
  request.on('error', function (e) {
    console.log('Problem with request: ' + e);
  });
  request.end();
};
