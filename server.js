"use strict";

var server;

var express = require('express'),
  http = require('http'),
  passport = require('passport');

global.db = require('./app/models');
var config = require('./config/environment');

var app = express();

// configure express
require('./config/express')(app, config);
// configure passport and session
require('./config/authenticate')(app, config, passport);
// configure routes
require('./config/routes')(app, config, passport);


// Catch 404 and forward to error handler. Any request
// not handled by express or routes configuration will
// invoke this middleware.
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development' || app.get('env') === 'runlocal') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).end();
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Snyc database if not in test mode
if (config.nodeEnv !== 'test') {
  db
    .sequelize
    .sync(config.sync)
    .complete(function(err) {
      if (err) {
        throw err[0]
      } else {
        // after database sync, start Express server
        startServer();
      }
    });
}
else {
  // Doing integration tests. No need to sync.
  startServer();
}

function startServer() {

  // stop annoying error message when testing.
  if (server !== undefined) {
    server.close();
  }

  // start server
  server = http.createServer(app).listen(config.port, function() {

    if (config.nodeEnv !== 'development') {
      try {
        console.log('Old User ID: ' + process.getuid() + ', Old Group ID: ' + process.getgid());
        process.setgid(config.gid);
        process.setuid(config.uid);
        console.log('New User ID: ' + process.getuid() + ', New Group ID: ' + process.getgid());
        console.log('Express server listening on port ' + config.port);
      } catch (err) {
        console.log('Refusing to keep the process alive as root.');
        process.exit(1);
      }
    }  else {
      console.log('Running with User Id: ' + process.getuid());
      console.log('Express server listening on port ' + config.port)
    }
  })

}

// This is needed when running from IDE
module.exports = app;

