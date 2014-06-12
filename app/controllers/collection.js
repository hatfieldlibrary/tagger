

exports.collectionByTagId = function(req, res) {

    var tagId = req.params.id,
        collList = new Array(),
        chainer = new db.Sequelize.Utils.QueryChainer;

    // retrieve collections with matching TagId
    db.TagTarget.findAll({
        where:
        {
            TagId: {
                eq: tagId
            }
        },
        order: [['title', 'ASC']],
        include: [db.Collection]

    }).success( function(coll) {

        // chain queries to retrieve other tags associated with each collection
        coll.forEach(function(entry) {
            var collId = entry.CollectionId;
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
                    // add result to global collList array
                    var tmpColl = entry.collection.getCollectionObject;
                    collList.push( { id: tmpColl.id, name: tmpColl.title, description: tmpColl.desc, url: tmpColl.url, image: tmpColl.image, tags: tags } );
                }).error(function(err) {
                    console.log(err)
                })
            )
        });
        chainer.run()
            .success(function() {
                // JSON response
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin','*');
                res.end(JSON.stringify(collList))
            })
            .error(function(err) {
                console.log(err);
            })

    }).error(function(err) {
        console.log(err);
    })

};

exports.create = function(req, res) {

    var collName = req.body.name;
    var collUrl = req.body.url;
    var collDesc = req.body.description;
    // First create the new collection. Then retrieve the
    // updated collection list and pass it to the view.
    async.series (
        {
            create: function (callback) {
                db.Collection.create({
                    title: collName,
                    url: collUrl,
                    description: collDesc
                }).complete(callback)
                    .error(function(err) {
                        console.log(err);
                    })
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
                    })
            }
        },
        function(err, result) {
            res.render('index', {
                title: 'Collections',
                collections: result.home
            })
        }
    )
};

exports.update = function(req, res) {

    var collName = req.body.name;
    var collUrl = req.body.url;
    var collDesc = req.body.description;
    var collId = req.body.id;
    // First update the collection. Then retrieve the updated
    // collection list and pass it to the view.
    async.series (
        {
            update:  function (callback) {
                db.Collection.update({
                        title: collName,
                        url: collUrl,
                        description: collDesc
                    },
                    {
                        id: {
                            eq: collId
                        }
                    }).complete(callback)
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
            if (err) console.log(err);
            res.render('index', {
                title: 'Collections',
                collections: result.home
            })
        }
    )
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
                    })
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
            if (err) console.log(err);
            res.render('index', {
                title: 'Collections',
                collections: result.home
            })
        }
    )
};


exports.updateImage = function (req, res, config) {

    // file upload requires ...
    var fs = require('fs'),
        multiparty = require('multiparty'),
        magick = require('imagemagick');



    var form = new multiparty.Form();
    var imageName;
    var id;


    form.parse(req, function (err, fields, files) {
        console.log(files.image);

        fs.readFile(files.image[0].path, function (err, data) {

            imageName = files.image[0].originalFilename;
            id = fields.id;
            console.log(imageName);
            /// If there's an error
            if (!imageName) {
                console.log("There was an error")
                res.redirect("/");
                res.end();

            } else {

                var newPath = config.root + "/public/images/full/" + imageName;
                var thumbPath = config.root + "/public/images/thumb/" + imageName;
                console.log(newPath);
                /// write file to uploads/fullsize folder
                fs.writeFile(newPath, data, function (err) {
                    if (err) {
                        console.log(err);
                        res.redirect("/");
                    }
                    else {
                        magick.resize({
                            srcPath: newPath,
                            dstPath: thumbPath,
                            width:   140
                        }, function(err, stdout, stderr){
                            if (err) console.log(err);
                            updateDb();
                        });
                    }


                });
            }
        });
    })

    function updateDb() {

        db.Collection.update({
                image: imageName
            },
            {
                id: {
                    eq: id
                }
            }
        ).success(function(err, result) {
                res.redirect("/form/collection/update/"+id)
            }
        ).error(function(err) {
                console.log(err);
            }
        )

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
                }).success(function (result) {
                        res.redirect("/form/collection/update/" + collId)
                    }
                ).error(function(err) {
                        console.log(err);
                    }
                )
            }
            else {
                res.redirect("/form/collection/update/" + collId)
            }
        }
    ).error(function(err) {
            console.log(err);
        }
    )
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
    }).success(function(result) {
        res.redirect("/form/collection/update/"+collId)
    }).error(function(err) {
        console.log(err);
    })
};