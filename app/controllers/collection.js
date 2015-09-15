'use strict';

var async = require('async');



// new admin interface
exports.overview = function(req, res){

  res.render('collectionOverview', {
    title: 'Overview',
    user: req.user.displayName,
    picture: req.user._json.picture
  });

};

exports.list = function (req, res) {

  var areaId = req.params.areaId;

  db.AreaTarget.findAll({
    where:
    {
      AreaId: {
        eq: areaId
      }
    },
    order: [['title', 'ASC']],
    include: [db.Collection]

  }).success( function(collections) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(collections));

  }).error(function(err) {
    console.log(err);
  });
};


exports.byId = function(req, res) {

  var collId = req.params.id;

  db.Collection.find(
    {
      where: {
        id: {
          eq: collId
        }
      }
    }
  ).success(function(collection) {
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify(collection));
    })
    .error(function (err) {
      console.log(err);
    })
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
  var repoType = req.body.repoType;
  var restricted = req.body.restricted;

  db.Collection.update({
      title: collName,
      url: collUrl,
      browseType: collBrowseType,
      description: collDesc,
      dates: collDates,
      items: collItems,
      ctype: collType,
      repoType: repoType,
      restricted: restricted
    },
    {
      id: {
        eq: collId
      }
    }).success(function(result){
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify({ status: 'success' }));
    })
    .error(function (err) {
      console.log(err);
    });


};

exports.add = function(req, res) {


  var title = req.body.title;
  var areaId = req.body.areaId;
  var newCollectionId;


  async.series({
      addCollection: function(callback) {
        db.Collection.create({
          title: title
        }).success(function(coll) {
           newCollectionId = coll.id;
           callback(null, coll)
        }).error(function(err) {
          console.log(err);
        });
      },
      addArea: function(callback) {
        db.AreaTarget.create({
          CollectionId: newCollectionId,
          AreaId: areaId
        }).success(function(result) {
          callback(null, result);
        }).error(function(err) {
          console.log(err);
        });
      },
      collections: function(callback) {
        db.AreaTarget.findAll({
          where: {
            AreaId: {
              eq: areaId
            }
          },
          include: [db.Collection],
          order: [['title', 'ASC']]
        }).success(function(colls) {
          callback(null, colls);
        }).error(function(err) {
          console.log(err);
        });
      }
    }, function(err, results) {
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify({ status: 'success', collections: results.collections}));
    }
  );



};

exports.delete = function (req, res) {
  var id = req.body.id;

  db.Collection.destroy({
    id: {
      eq: id
    }
  }).success(function() {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify({ status: 'success'}));
  }).error(function (err) {
    console.log(err);
  });
};


// end new admin interface



// chain queries to retrieve other tags associated with each collection
var processCollectionResult = function(coll, res) {

  var count = coll.count;
  var collList = [],
    chainer = new db.Sequelize.Utils.QueryChainer();

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

exports.tagsForCollection = function (req, res) {

  var collId = req.params.id;

  db.TagTarget.findAll(
    {
      where: {
        CollectionId: {
          eq: collId
        }
      },
      include : [db.Tag],
      attributes: ['Tag.name','Tag.id']
    }).success( function(tags) {
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify(tags));

    }).error(function(err) {
      console.log(err);
    });

};

exports.typesForCollection = function (req, res) {

  var collId = req.params.id;

  db.ItemContentTarget.findAll(
    {
      where: {
        CollectionId: {
          eq: collId
        }
      },
      include: [db.ItemContent]
    }
  ).success(function(types) {
      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify(types));
    })
    .error(function (err) {
      console.log(err);
    })

};

exports.collectionsByArea = function (req, res) {

  var areaId = req.params.id;
  db.AreaTarget.findAll({
    where:
    {
      AreaId: {
        eq: areaId
      }
    },
    order: [['title', 'ASC']],
    include: [db.Collection]

  }).success( function(collections) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(collections));

  }).error(function(err) {
    console.log(err);
  });
};

exports.collectionsBySubject = function (req, res) {

  var subjectId = req.params.id;
  var areaId = req.params.areaId;

  db.TagTarget.findAll({
    where:
    {
      TagId: {
        eq: subjectId
      }
    },
    order: [['name', 'ASC']],
    include: [
      { model: db.Collection},
      { model: db.Tag,
        where: {
          areaId: {
            eq: areaId
          }
        }
      }]

  }).success( function(collections) {

    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(collections));

  }).error(function(err) {
    console.log(err);
  });
};

/*
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
 */

exports.collectionById = function(req, res) {

  var chainer = new db.Sequelize.Utils.QueryChainer();
  var collId = req.params.id;
  var result = {
    collection: {},
    category: {},
    contentTypes: []
  };

  chainer.add(
    db.Collection.find(
      {
        where: {
          id: {
            eq: collId
          }
        }
      }
    ).success(function(collection) {
        result.collection.title = collection.title;
        result.collection.url = collection.url;
        result.collection.description = collection.description;
        result.collection.image = collection.image;
        result.collection.dates = collection.dates;
        result.collection.items = collection.items;
        result.collection.browseType = collection.browseType;
        result.collection.collType = collection.ctype;
        result.collection.restricted = collection.restricted;
        result.collection.searchType = collection.repoType;
      })
      .error(function (err) {
        console.log(err);
      })
  );
  chainer.add(
    db.CategoryTarget.find(
      {
        where: {
          CollectionId: {
            eq: collId
          }
        },
        include: [db.Category]
      }
    ).success(function(category) {
        if (category === null) {
          result.category.title = '';
          result.category.description = '';
        } else if (category.category  === null) {
          result.category.title = '';
          result.category.description = '';
        }else {
          result.category.title = category.category.title;
          result.category.description  = category.category.description;
          result.category.url = category.category.url;
          result.category.linkLabel = category.category.linkLabel;
        }

      })
      .error(function (err) {
        console.log(err);
      }
    )
  );
  chainer.add(
    db.ItemContentTarget.findAll(
      {
        where: {
          CollectionId: {
            eq: collId
          }
        },
        include: [db.ItemContent]
      }
    ).success(function(types) {
        result.contentTypes = types;
      })
      .error(function (err) {
        console.log(err);
      })
  );
  chainer.run()
    .success(function() {

      // JSON response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin','*');
      res.end(JSON.stringify(result));

    })
    .error(function(err) {
      console.log(err);
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

exports.allCollections = function (req, res) {
  db.Collection.findAll({
    attributes: ['id','title'],
    order:[['title', 'ASC']]
  }).success( function(collections) {
    // JSON response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(collections));

  }).error(function(err) {
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


exports.oldcreate = function(req, res) {

  var collName = req.body.name;
  var collUrl = req.body.url;
  var collBrowseType = req.body.browseType;
  var collDesc = req.body.description;
  var collDates = req.body.dates;
  var collItems = req.body.items;
  var collType = req.body.ctype;
  var categoryId = req.body.categoryId;
  var restricted = req.body.restricted;
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
          ctype: collType,
          categoryId: categoryId,
          restricted: restricted
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

exports.oldupdate = function(req, res) {

  var collName = req.body.name;
  var collUrl = req.body.url;
  var collBrowseType = req.body.browseType;
  var collDesc = req.body.description;
  var collId = req.body.id;
  var collDates = req.body.dates;
  var collItems = req.body.items;
  var collType = req.body.ctype;
  var repoType = req.body.repoType;
  var restricted = req.body.restricted;
  //var categoryId = req.body.categoryId;
  var areas = req.body.areas;

  // First update the collection. Then retrieve the updated
  // collection list and pass it to the view.
  async.series (
    {
      update:  function (callback) {
        console.log('update ' +repoType);
        db.Collection.update({
            title: collName,
            url: collUrl,
            browseType: collBrowseType,
            description: collDesc,
            dates: collDates,
            items: collItems,
            ctype: collType,
            repoType: repoType,
            restricted: restricted
          },
          {
            id: {
              eq: collId
            }
          }).complete(callback);
      },
      // these two tasks in the series are needed
      // because we update area and category targets
      // from within the collection update UI. They
      // probably could and should be moved when the
      // tagger UI is updated.
      dropAreaTargets: function(callback) {
        db.AreaTarget.destroy({
          CollectionId: {
            eq: collId
          }
        }).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      addAreaTargets: function(callback) {
        var newTargets = [];
        for (var i = 0; i < areas.length; i++) {
          newTargets[i] = { AreaId: areas[i], CollectionId: collId };
        }
        console.log(newTargets);
        db.AreaTarget.bulkCreate(
          newTargets
        ).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      /*dropCategoryTarget: function(callback) {
       db.CategoryTarget.destroy({
       CollectionId: {
       eq: collId
       }
       }).complete(callback)
       .error(function(err) {
       console.log(err);
       });
       },
       addCategoryTarget: function(callback) {
       db.CategoryTarget.create({
       CollectionId: collId,
       CategoryId: categoryId
       }).complete(callback)
       .error(function(err) {
       console.log(err);
       });
       },  */
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


exports.addArea = function(req, res) {

  var areaId = req.body.areaid;
  var collId = req.body.collid;
  // only add tag if not already attached to the collection
  db.AreaTarget.find(
    {
      where: {
        CollectionId: {
          eq: collId
        },
        areaId: {
          eq: areaId
        }
      }
    }
  ).success(function(result)
    {
      console.log(result);
      if (result === null) {
        db.AreaTarget.create({
          collectionId: collId,
          areaId: areaId
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


exports.removeType = function(req, res) {
  var collId = req.params.collid;
  var typeId = req.params.type;
  db.ItemContentTarget.destroy({
    CollectionId: {
      eq: collId
    },
    ItemContentId: {
      eq: typeId
    }
    /*jshint unused:false*/
  }).success(function(result) {
    res.redirect('/admin/form/collection/update/'+collId);
  }).error(function(err) {
    console.log(err);
  });
};

exports.removeArea = function(req, res) {
  var collId = req.params.collid;
  var areaId = req.params.areaid;
  db.AreaTarget.destroy({
    collectionId: {
      eq: collId
    },
    areaId: {
      eq: areaId
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

exports.index = function(req, res){


  res.render('collectionOverview', {
    title: 'Overview',
    user: req.user.displayName,
    picture: req.user._json.picture
  });

};
