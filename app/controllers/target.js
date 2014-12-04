'use strict';

/**
 * Created by mspalti on 5/29/14.
 */

exports.create = function(req, res){

    db.TagTarget.create({ collId: 1, TagId: 1, CollectionId: 1 })
        .success(function(tags) {
            res.render('index', {
                title: 'Express',
                users: tags
            });
        }).error(function(err) {
            console.log(err);
        });

};

exports.index = function(req, res){

    db.TagTarget.findAll({include: [db.Collection]}).success(function(tags) {
        res.render('index', {
            title: 'Express',
            users: tags
        });
    });
};
