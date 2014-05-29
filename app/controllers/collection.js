

exports.create = function(req, res){

    db.Collection.create({ title: 'collection one', url: 'http', description: 'collection description'})
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
            users: tags
        })
    })
};