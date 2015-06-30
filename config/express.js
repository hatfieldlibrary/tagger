
var express = require('express');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var path = require('path');
var fs = require('fs');

module.exports = function(app, config) {

  app.set('port', config.port);
  app.set('views', path.join(config.root, '/app/views'));
  app.set('view engine', 'jade');
  app.set('view engine', 'html');

  //app.use(helmet());

 // hbs.registerPartials(express.static(config.root + config.resourcePath + '/views/partials'));

  // setup static file paths
  // admin ui
  app.use('/img', express.static(config.root + '/public/images'));
  app.use('/javascripts/application.js', express.static(config.root + '/public/javascripts/application.js'));
  app.use('/javascripts/vendor', express.static(config.root + '/public/javascripts/vendor'));

 // app.use('/javascripts', express.static( config.root + config.modulePath + '/bower_components/foundation/js'));
  app.use('/stylesheets', express.static( config.root + '/public/stylesheets'));
  // collection images
  app.use('/resources/img', express.static(config.taggerImageDir));
  // public ui
  app.use('/js', express.static(config.root + config.resourcePath + '/js'));
  app.use('/css', express.static(config.root + config.resourcePath + '/css'));
  app.use('/images', express.static(config.root + config.resourcePath + '/images'));
  app.use('/commons/info', express.static(config.root + config.modulePath + '/extras'));
  app.use('/commons/robots.txt', express.static(config.root + config.modulePath + '/robots.txt'));
  // development
  app.use('/bower_components', express.static(config.root + config.modulePath + '/bower_components'));
  app.use('/commons/bower_components', express.static(config.root + config.modulePath + '/bower_components'));


  app.use(favicon(config.root + '/favicon.ico'));
  // setup the access logger
  var accessLogStream = fs.createWriteStream('/var/log/tagger/public/access.log', {flags: 'a'});
  app.use(logger('combined', {stream: accessLogStream}));
  app.use(bodyParser());
  app.use(cookieParser());


};
