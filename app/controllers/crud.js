'use strict';
/**
 * Created by mspalti on 5/30/14.
 */

var async = require('async');


// new admin interface
exports.overview = function(req, res){

  res.render('layout', {
    title: 'Overview',
    user: req.user.displayName,
    picture: req.user._json.picture,
    areaId: req.user.areaId
  });

};


exports.login = function(req, res) {
  res.render('login', {
    title: 'Login'
  });
};
