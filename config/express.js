
var express = require('express');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet')

module.exports = function(app, config) {

  app.set('port', config.port);
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  app.use(helmet());

  // setup static file paths
  // admin ui
  app.use('/img', express.static(config.root + '/public/images'));
  app.use('/javascripts/application.js', express.static(config.root + '/public/javascripts/application.js'));
  app.use('/javascripts/jquery-ui-1.11.2.js', express.static(config.root + '/public/javascripts/jquery-ui-1.11.2.js'));
  app.use('/javascripts', express.static( config.root + config.modulePath + '/bower_components/foundation/js'));
  app.use('/stylesheets', express.static( config.root + '/public/stylesheets'));
  // collection images
  app.use('/resources/img', express.static(config.taggerImageDir));
  // public ui
  app.use('/js', express.static(config.root + config.modulePath + '/js'));
  app.use('/css', express.static(config.root + config.modulePath + '/css'));
  app.use('/images', express.static(config.root + config.modulePath + '/images'));
 // app.use('/css/fonts', express.static(config.root + config.modulePath + '/css/fonts'));
  app.use('/commons/info', express.static(config.root + config.modulePath + '/extras'));
  app.use('/commons/robots.txt', express.static(config.root + config.modulePath + '/robots.txt'));
  // development
  app.use('/bower_components', express.static(config.root + config.modulePath + '/bower_components'));
  app.use('/commons/bower_components', express.static(config.root + config.modulePath + '/bower_components'));


  app.use(favicon(config.root + '/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser());
  app.use(cookieParser());


};
