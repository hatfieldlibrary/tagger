/**
 * Created by mspalti on 5/23/14.
 */

exports.create = function(req, res){

   var tagName =  req.body.name;
   db.Tag.create({name: tagName})
    .success(function() {
           db.Tag.findAll().success(function(tags) {
               res.render('tagIndex', {
                   title: 'Tags',
                   tags: tags
               })
           })
    })

};

exports.tagIndex = function(req, res) {

    db.Tag.findAll().success(function(tags) {
        res.render('tagIndex', {
            title: 'Tags',
            tags: tags
        })
    })
};

exports.tagUpdate = function (req, res) {

    var tagId = req.body.id;
    var tagName = req.body.name;
    async.series (
        {
            update: function (callback) {
                db.Tag.update(
                    {
                        name: tagName
                    },
                    {
                        id: {
                            eq: tagId
                        }
                    }).complete(callback)
            },
            tags: function(callback) {
                db.Tag.findAll(
                    {
                        order: [['name', 'ASC']]
                    }
                ).complete(callback)
            }
        },
        function (err, result) {
            res.render('tagIndex', {
                title: 'Tags',
                tags: result.tags
            })
        }
    )
};

exports.delete = function (req, res) {

    var tagId = req.params.id;
    async.series (
        {
            delete: function(callback)  {
                db.Tag.destroy(
                    {
                        id: {
                            eq: tagId
                        }
                    }
                ).complete(callback)
            },
            home: function(callback) {
                db.Tag.findAll(
                    {
                        order: [
                            ['name', 'ASC']
                        ]
                    }
                ).complete(callback)
            }
        },
        function (err, result) {
            res.render('tagIndex', {
                title: 'Tags',
                tags: result.home
            })
        }
    )
}

