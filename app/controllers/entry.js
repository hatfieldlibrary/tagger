'use strict';

var async = require('async');


exports.login = function(req, res) {
  res.render('login', {
    title: 'Login'
  });
};
