"use strict;"

var server;

var express = require('express'),
  session = require('express-session'),
  http = require('http'),
  passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  logger = require('morgan'),
  fs = require('fs');
  //RedisStore = require('connect-redis')(session);


var config = require('./config/environment');
global.db = require('./app/models');

var app = express();

require('./config/express')(app, config);


// Attempting to use Redisstore for sessions.  Not
// able to get this working with OAuth, yet.  The
// advantage of Redisstore is that sessions persist
// when the application is restarted, and we eliminate
// a pesky warning when launching in production mode.
// In practice, lost sessions will seldom - if ever - be a problem
// for us and the few administrative users who use tagger.
//app.use(session({
//    store: new RedisStore({
//      host: config.redis.host,
//      port: config.redis.port,
//      db: 2,
//      pass: 'rdpasswd'
//    }),
//    secret: 'keyboardcat',
//    resave: true,
//   saveUninitialized: true })
//);
// Use express-session in lieu of Redisstore.
app.use(session({secret: 'keyboard cat', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());

// setup the access logger
var accessLogStream = fs.createWriteStream('/var/log/tagger/public/access.log', {flags: 'a'});
app.use(logger('combined',{stream: accessLogStream}));


// Google OAUTH2.
var GOOGLE_CLIENT_ID = config.googleClientId;
var GOOGLE_CLIENT_SECRET = config.googleClientSecret;
var GOOGLE_CALLBACK = config.googleCallback;
// passport used for Google OAuth2
// define serializer and deserializer
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
// Configure Google authentication for this application
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification
    process.nextTick(function () {
      // attempt to retrieve user by their Google profile
      // email address
      db.Users.find({ attributes: ['id'],
        where: {
          email: {
            eq: profile._json.email
          }
        }
      }).success( function (user, err) {
        // if email lookup succeeded, pass the user id to passport callback
        if (user) {
          console.log(user);
          return done(err, user.dataValues.id);
        }
        // otherwise pass null (unauthenticated)
        done(null, null);
      });
    });
  }
));


// Route middleware ensures user is authenticated.
// Use this middleware on any resource that needs to be protected.  If
// the request is authenticated (typically via a persistent login session),
// the request will proceed.  Otherwise, the user will be redirected to the
// login page.
app.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

// configure routes.
require('./config/routes')(app, config, passport);

/// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development' || app.get('env') === 'runlocal') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.error(err.stack);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.error(err.stack);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
});

// Snyc database if not in test mode then start server
if (config.nodeEnv !== 'test') {
  db
    .sequelize
    .sync(config.sync)
    .complete(function(err) {
      if (err) {
        throw err[0]
      } else {
        startServer();
      }
    });
}
// Doing integration tests.  These drop database tables
// before they run. For now, just start the server.
else {
  startServer();
}

function startServer() {

  // stop annoying error message when testing.
  if (server !== undefined) {
    server.close();
  }
  server = http.createServer(app).listen(config.port, function() {

    if (config.nodeEnv !== 'development') {
      try {
        console.log('Old User ID: ' + process.getuid() + ', Old Group ID: ' + process.getgid());
        process.setgid(config.gid);
        process.setuid(config.uid);
        console.log('New User ID: ' + process.getuid() + ', New Group ID: ' + process.getgid());
        console.log('Express server listening on port ' + config.port);
      } catch (err) {
        console.log('Cowardly refusing to keep the process alive as root.');
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

