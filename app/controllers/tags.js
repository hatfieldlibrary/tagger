/**
 * Created by mspalti on 5/23/14.
 */

exports.create = function(req, res){

   db.Tag.create({name: 'tag one'})
    .success(function(tags) {
        res.render('index', {
            title: 'Express',
            users: tags
        })
    })

};

exports.index = function(req, res){

    db.Tag.findAll({include: [db.Tag]}).success(function(tags) {
        res.render('index', {
            title: 'Express',
            users: tags
        })
    })
};

