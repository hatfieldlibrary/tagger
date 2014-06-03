


exports.create = function(req, res){

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
            },
            home: function (callback) {
                db.Collection.findAll(
                    {
                        attributes: ['id','title', 'url', 'description'],
                        order: [['title', 'ASC']]
                    }
                ).complete(callback)
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
            update: function(callback) {
                db.Collection.destroy({
                    id: {
                        eq: collId
                    }
                }).complete(callback)
            },
            home: function(callback) {
                db.Collection.findAll(
                    {
                        attributes: ['id','title', 'url', 'description'],
                        order: [['title', 'ASC']]
                    }
                ).complete(callback);
            }
        }, function(err, result) {
            res.render('index', {
                title: 'Collections',
                collections: result.home
            })
        }
    )
};


