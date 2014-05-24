/**
 *
 * Created by mspalti on 5/23/14.
 */

var db = require('../models')

exports.index = function(req, res){
    db.Tag.findAll({
        include: [ db.Collection ]
    }).success(function(tags) {
        res.render('index', {
            title: 'Express',
            users: tags
        })
    })
}