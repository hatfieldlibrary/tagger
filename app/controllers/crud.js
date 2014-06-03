/**
 * Created by mspalti on 5/30/14.
 */

exports.index = function(req, res){

    db.Collection.findAll(
        {
            order: [['title', 'ASC']]
        }
    ).success(function(cols) {
        res.render('index', {
            title: 'Collections',
            collections: cols
        })
    })
};

exports.collCreate = function(req, res){

    res.render('collectionCreate', {
        title: 'Create Collection'
    })

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
                    }).complete(callback);
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
                    }).complete(callback);
            }
        },
        function(err, rd){
            var collectionData = rd.collectionData;
            var tags = rd.tagData;
            console.log(tags);
            res.render('collectionUpdate', {
                title: 'Update Collection',
                collName: collectionData.title,
                collUrl: collectionData.getCollectionObject.url,
                collDesc: collectionData.getCollectionObject.desc,
                collId: collectionData.id,
                tags: tags
            })
        }
    );
};


exports.tagCreate = function(req, res) {
    res.render('tagCreate', {
         title: 'Create Tag'
    })
};

exports.tagUpdate = function (req, res) {
    var tagId = req.params.id;
    db.Tag.find(
        {
            where: {
                id: {
                    eq: tagId
                }
            },
            attributes: ['id','name']
        }
    ).success(function(tag) {
            res.render('tagUpdate', {
                title: 'Update Tag',
                tag: tag
            })
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
            })
    })
};