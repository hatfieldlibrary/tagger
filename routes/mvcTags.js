/**
 * Created by mspalti on 5/23/14.
 */

var db = require('../models')

exports.create = function(req, res){

    db.Tag.create({name: 'tag one'})
    .success(function(tags) {
        res.render('index', {
            title: 'Express',
            users: tags
        })
    })

}