'use strict';
/**
 * Created by mspalti on 5/30/14.
 */

var async = require('async');


exports.login = function(req, res) {
  res.render('login', {
    title: 'Login'
  });
};
