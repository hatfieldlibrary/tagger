

exports.create = function(req, res){

    var collName = req.body.name;
    var collUrl = req.body.url;
    var collDesc = req.body.description;
    db.Collection.create({ title: collName, url: collUrl, description: collDesc})
        .success(function(tags) {
            res.render('index', {
                title: 'Express',
                users: tags
            })
        })

};

exports.index = function(req, res){

    db.Collection.findAll({include: [db.Collection]}).success(function(tags) {
        res.render('index', {
            title: 'Express',
            tags: tags
        })
    })
};