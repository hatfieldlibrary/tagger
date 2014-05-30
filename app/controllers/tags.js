/**
 * Created by mspalti on 5/23/14.
 */

exports.create = function(req, res){

   var tagName =  req.body.name;
   db.Tag.create({name: tagName})
    .success(function(tags) {
        res.render('index', {
            title: 'Tag Added',
            tags: tags.getTagObject.name
        })
    })

};

exports.index = function(req, res){

    db.Tag.findAll({attributes: 'name'}).success(function(tags) {
        res.render('index', {
            title: 'Express',
            tags: tags.getTagObject
        })
    })
};

