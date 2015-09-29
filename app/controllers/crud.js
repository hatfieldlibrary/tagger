'use strict';
/**
 * Created by mspalti on 5/30/14.
 */

var async = require('async');


// new admin interface
exports.overview = function(req, res){

  res.render('layout', {
    title: 'Overview',
    user: req.user.displayName,
    picture: req.user._json.picture,
    areaId: req.user.areaId
  });

};


exports.login = function(req, res) {
  res.render('login', {
    title: 'Login'
  });
};

exports.index = function(req, res){

  db.Collection.findAll(
    {
      order: [['title', 'ASC']]
    }
  ).success(function() {
      res.render('collectionOverview', {
        title: 'Overview',
        user: req.user.displayName,
        picture: req.user._json.picture
        //,
       // collections: cols
      });
    }).error(function(err) {
      console.log(err);
    });
};


exports.tagIndex = function(req, res) {
  async.parallel (
    {
      tags: function (callback) {
        db.Tag.findAll({
          order: [['name', 'ASC']]
        }).complete(callback)
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
    }, function(err,rd) {
      res.render('tagIndex', {
        title: 'Tags',
        tags: rd.tags,
        areas: rd.areas
      });
    });
};

exports.areaIndex = function(req, res) {

  db.Area.findAll({
    order: [['title', 'ASC']]
  })
    .success(function(areas) {
      res.render('areaIndex', {
        title: 'Areas',
        areas: areas
      });
    }).error(function(err) {
      console.log(err);
    });
};

exports.categoryIndex = function(req, res) {

  db.Category.findAll({
    order: [['title', 'ASC']]
  })
    .success(function(categories) {
      res.render('categoryIndex', {
        title: 'Category',
        categories: categories
      });
    }).error(function(err) {
      console.log(err);
    });
};

exports.contentIndex = function(req, res) {

  db.ItemContent.findAll().success(function(ctypes) {
    res.render('contentIndex', {
      title: 'Content Types',
      tags: ctypes
    });
  }).error(function(err) {
    console.log(err);
  });
};

exports.collCreate = function(req, res){

  res.render('collectionCreate', {
    title: 'Create Collection'
  });

};

// The Collection update controller fires two parallel queries.
// The first just retrieves collection information from the
// Collections table.  The second returns the result of a join
// between the Tags and TagTargets tables.
exports.collUpdate = function(req, res) {

  var collId = req.params.id;
  // Using async to execute parallel requests.
  async.parallel (
    {
      collectionData: function (callback) {
        db.Collection.find(
          {
            where: {
              id: {
                eq: collId
              }
            }
            // Using complete: it takes a callback with signature (err,res).
            // This is compatible with async.
          }).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      tagData: function(callback)
      {
        db.TagTarget.findAll(
          {
            where: {
              CollectionId: {
                eq: collId
              }
            },
            include : [db.Tag],
            attributes: ['Tag.name','Tag.id']
          }).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      categories: function(callback) {
        db.Category.findAll().complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      currentCategory: function(callback) {
        db.CategoryTarget.find(
          {
            where: {
              CollectionId: {
                eq: collId
              }
            },
            include : [db.Category],
            attributes: ['Category.title','Category.id']
          }
        ).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      },
      areaData: function(callback) {
        db.AreaTarget.findAll(
          {
            where: {
              CollectionId: {
                eq: collId
              }
            },
            include : [db.Area],
            attributes: ['Area.title','Area.id']
          }
        ).complete(callback).error(function(err) {
            console.log(err);
          });
      },
      areas: function(callback) {
        db.Area.findAll(
          {
            attributes: ['id','title']
          }
        ).complete(callback).error(function(err) {
            console.log(err);
          });
      },
      typeData: function(callback)
      {
        db.ItemContentTarget.findAll(
          {
            where: {
              CollectionId: {
                eq: collId
              }
            },
            include : [db.ItemContent],
            attributes: ['ItemContent.name','ItemContent.id']
          }).complete(callback)
          .error(function(err) {
            console.log(err);
          });
      }
    },
    function(err, rd){
      var collectionData = rd.collectionData;
      var tags = rd.tagData;
      var types = rd.typeData;
      var categories = rd.categories;
      var currentCategory = rd.currentCategory;
      var areas = rd.areaData;
      var availableAreas = rd.areas;
      console.log('test ' +collectionData.restricted);
      res.render('collectionUpdate', {
        title: 'Update Collection',
        collName: collectionData.title,
        collUrl: collectionData.getCollectionObject.url,
        collBrowseType: collectionData.getCollectionObject.browseType,
        collDesc: collectionData.getCollectionObject.desc,
        collImg: collectionData.getCollectionObject.image,
        collItems: collectionData.getCollectionObject.items,
        collDates: collectionData.getCollectionObject.dates,
        collType: collectionData.getCollectionObject.ctype,
        searchType: collectionData.getCollectionObject.repoType,
        //categoryId: collectionData.getCollectionObject.categoryId,
        restricted: collectionData.restricted,
        collId: collectionData.id,
        tags: tags,
        categories: categories,
        currentCategory: currentCategory,
        areas: areas,
        availableAreas: availableAreas,
        types: types
      });
    }
  );
};

 // not in use...
exports.tagCreate = function(req, res) {
  db.Area.findAll(
    {
      attributes: ['title','id']
    }
  ).success(function(areas) {
      res.render('tagCreate', {
        title: 'Create Tag',
        areas: areas
      });
    });
};

exports.tagUpdate = function (req, res) {
  var tagId = req.params.id;
  async.parallel (
    {
      tag: function (callback) {
        db.Tag.find(
          {
            where: {
              id: {
                eq: tagId
              }
            },
            attributes: ['id','name','url','areaId']
          }).complete(callback)
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
    function(err, rd) {
      var tag = rd.tag;
      var areas = rd.areas;
      res.render('tagUpdate', {
        title: 'Tags',
        tag: tag,
        areas: areas
      });
    });
};

exports.areaUpdate = function (req, res) {
  var areaId = req.params.id;
  db.Area.find(
    {
      where: {
        id: {
          eq: areaId
        }
      },
      attributes: ['id','title','linkLabel','url','searchUrl','description']
    }
  ).success(function(area) {
      res.render('areaUpdate', {
        title: 'Update Area',
        area: area
      });
    }
  ).error(function(err) {
      console.log(err);
    });
};

exports.categoryUpdate = function (req, res) {
  var catId = req.params.id;
  db.Category.find(
    {
      where: {
        id: {
          eq: catId
        }
      },
      attributes: ['id','title','linkLabel','url','secondaryUrl','description']
    }
  ).success(function(categories) {
      res.render('categoryUpdate', {
        title: 'Update Category',
        category: categories
      });
    }
  ).error(function(err) {
      console.log(err);
    });
};

exports.contentCreate = function(req, res) {
  res.render('contentCreate', {
    title: 'Create Content Type'
  });
};

exports.contentUpdate = function (req, res) {
  var contentId = req.params.id;
  db.ItemContent.find(
    {
      where: {
        id: {
          eq: contentId
        }
      },
      attributes: ['id','name']
    }
  ).success(function(ctype) {
      res.render('contentUpdate', {
        title: 'Update Content Type',
        type: ctype
      });
    }
  ).error(function(err) {
      console.log(err);
    });
};


exports.collUp  = function(req, res) {
  var collId = req.params.id;
  db.TagTarget.findAll(
    {
      where: {
        CollectionId: {
          eq: collId
        }
      },
      include: [db.Tag, db.Collection],
      attributes:[ 'Collection.description','Collection.url', 'Collection.title']
    }
  ).success(function(collections) {
      var c = collections[0].collection.getCollectionObject;
      res.render('collectionUpdate', {
          title: 'Tag Collection',
          tags: collections,
          collName: c.name,
          collUrl: c.url,
          collDesc: c.desc
        }
      );
    }).error(function(err) {
      console.log(err);
    });
};


