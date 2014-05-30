/**
 * Created by mspalti on 5/30/14.
 */

exports.collCreate = function(req, res){

    res.render('collection', {
        title: 'Create Collection'
    })

};

exports.tagCreate = function(req, res) {
    res.render('tagCreate', {
         title: 'Create Tag'
    })
};

exports.collTagger  = function(req, res) {
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
            res.render('collectiontagger', {
                title: 'Tag Collection',
                tags: collections,
                collName: c.name,
                collUrl: c.url,
                collDesc: c.desc
            })
    })
};