
var express = require('express');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


module.exports = function(app, config) {


  // admin ui resources
  app.use('/images', express.static(config.root + '/public/images'));
  app.use('/javascripts', express.static(config.root + '/public/javascripts'));
  app.use('/stylesheets', express.static( config.root + '/public/stylesheets'));
  // public ui resources
  app.use('/commons/bower_components', express.static(config.root + config.modulePath + '/bower_components'));
  app.use('/commons/js', express.static(config.root + config.modulePath + '/js'));
  app.use('/commons/css', express.static(config.root + config.modulePath + '/css'));
  app.use('/commons/images', express.static(config.root + config.modulePath + '/images'));

  app.set('port', config.port);
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');
  app.use(favicon(config.root + '/acom/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser());
  app.use(cookieParser());


};
