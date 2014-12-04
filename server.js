"use strict";

var server;

var express = require('express'),
  session = require('express-session'),
  http = require('http'),
  cookieParser = require('cookie-parser'),
  passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  redis = require('redis'),
  RedisStore = require('connect-redis')(session);

var client = redis.createClient();

var config = require('./config/environment');
global.db = require('./app/models');

var app = express();

require('./config/express')(app, config);


if (app.get('env') === 'development' || app.get('env') === 'runlocal') {
// Use express-session in lieu of Redisstore.
  app.use(session({secret: 'keyboard cat', saveUninitialized: true, resave: true}));
} else if (app.get('env') === 'production') {
  // using redis as the production session store
  app.use( cookieParser());
  app.use(session(
    {
      secret: 'insideoutorup',
      store: new RedisStore({host: '127.0.0.1', port: 3002, client: client}),
      saveUninitialized: true, // don't create session until something stored,
      resave: true // don't save session if unmodified
    }
  ));
}

app.use(passport.initialize());
app.use(passport.session());

// Google OAUTH2.
var GOOGLE_CLIENT_ID = config.googleClientId;
var GOOGLE_CLIENT_SECRET = config.googleClientSecret;
var GOOGLE_CALLBACK = config.googleCallback;
// passport used for Google OAuth2
// define serializer and deserializer
passport.serializeUser(function(user, done) {
  done(null, {id:user});
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

// Catch 404 and forward to error handler. Any request
// not handled by express or routes configuration will
// invoke this middleware.
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
 // res.render('error', {
 //   message: err.message,
 //   error: {}
 // });
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

