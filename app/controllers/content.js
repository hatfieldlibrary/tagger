/**
 * Created by mspalti on 8/1/14.
 */

exports.create = function(req, res) {

    var cName = req.body.name;

    // async not really required here
    async.parallel (
        {
            check: function (callback) {
                db.ItemContent.find(
                    {
                        where: {
                            name: {
                                eq: cName
                            }
                        }
                    }
                ).complete(callback)
                    .error(function (err) {
                        console.log(err);
                    });
            }
        }, function (err, result) {
            if (err) console.log(err);
            if (result.check === null) {
                db.ItemContent.create(
                    {
                        name: cName
                    }).success(function (items) {
                        db.ItemContent.findAll()
                            .success(function (ctypes) {
                                res.render('contentIndex', {
                                    title: 'Content Types',
                                    tags: ctypes,
                                    exists: false

                                })
                            }).error(function (err) {
                                console.log(err);
                            });
                    })
                    .error(function (err) {
                        console.log(err);
                    });
            } else {
                db.ItemContent.findAll()
                    .success(function (ctypes) {
                        res.render('contentIndex', {
                            title: 'Content Types',
                            tags: ctypes,
                            exists: true
                        })
                    }).error(function (err) {
                        console.log(err);
                    });
            }

        }

    )
};

exports.contentUpdate = function (req, res) {

    var contentId = req.body.id;
    var contentName = req.body.name;
    async.series (
        {
            update: function (callback) {
                db.ItemContent.update(
                    {
                        name: contentName
                    },
                    {
                        id: {
                            eq: contentId
                        }
                    }).complete(callback)
            },
            ctypes: function(callback) {
                db.ItemContent.findAll(
                    {
                        order: [['name', 'ASC']]
                    }
                ).complete(callback)
                    .error(function(err) {
                        console.log(err);
                    })
            }
        },
        function (err, result) {
            res.render('contentIndex', {
                title: 'Content Types',
                tags: result.ctypes
            })
        }
    )
};

exports.delete = function (req, res) {

    var contentId = req.params.id;
    async.series (
        {
            delete: function(callback)  {
                db.ItemContent.destroy(
                    {
                        id: {
                            eq: contentId
                        }
                    }
                ).complete(callback)
                    .error(function(err) {
                        console.log(err);
                    })
            },
            home: function(callback) {
                db.ItemContent.findAll(
                    {
                        order: [
                            ['name', 'ASC']
                        ]
                    }
                ).complete(callback)
                    .error(function(err) {
                        console.log(err);
                    })
            }
        },
        function (err, result) {
            res.render('contentIndex', {
                title: 'Content Types',
                tags: result.home
            })
        }
    )
};

exports.getTypeList = function(req, res) {

    db.ItemContent.findAll()
        .success(function(result) {
            var arr = new Array();
            for  (var i = 0; i < result.length; i++) {
                var tmp =  result[i].getContentObject;
                arr[i] = { label: tmp.name, value : tmp.name, id: tmp.id}
            }
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin','*');
            res.end(JSON.stringify(arr))
        }).error(function(err) {
            console.log(err);
        });

};

exports.getTypeInfo = function(req, res) {

    var typeId = req.params.id;
    db.ItemContent.find({
        where: {
            id: {
                eq: typeId

            }
        }
    }).success(function(result) {
        // JSON response
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin','*');
        res.end(JSON.stringify(result.getContentObject))
    }).error(function(err) {
        console.log(err);
    })

};