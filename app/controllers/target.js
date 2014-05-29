/**
 * Created by mspalti on 5/29/14.
 */

exports.create = function(req, res){

    db.TagTarget.create({ coll_id: 1, TagId: 1, CollectionId: 1 })
        .success(function(tags) {
            res.render('index', {
                title: 'Express',
                users: tags
            })
        })

};

exports.index = function(req, res){

    db.TagTarget.findAll({include: [db.Collection]}).success(function(tags) {
        res.render('index', {
            title: 'Express',
            users: tags
        })
    })
};