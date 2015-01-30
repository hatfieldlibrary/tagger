'use strict';
/**
 * Created by mspalti on 12/4/14.
 */

var session = require('express-session'),
  cookieParser = require('cookie-parser'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  redis = require('redis'),
  RedisStore = require('connect-redis')(session);


module.exports = function(app, config, passport) {

  // For development, use express-session in lieu of Redisstore.
  if (app.get('env') === 'development' || app.get('env') === 'runlocal') {
    app.use(session({
      secret: 'keyboard cat',
      saveUninitialized: true,
      resave: true
      })
    );
  // Use redis as the production session store for oauth2.
  // http://redis.io/
  } else if (app.get('env') === 'production') {
    console.log('production');
    var client = redis.createClient(
      config.redisPort, '127.0.0.1',
      {}
    );
    app.use(cookieParser());
    app.use(session(
      {

        secret: 'insideoutorup',
        store: new RedisStore({host: '127.0.0.1', port: config.redisPort, client: client}),
        saveUninitialized: false, // don't create session until something stored,
        resave: false // don't save session if unmodified
      }
    ));
  }

  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAUTH2.
  var GOOGLE_CLIENT_ID = config.googleClientId;
  var GOOGLE_CLIENT_SECRET = config.googleClientSecret;
  var GOOGLE_CALLBACK = config.googleCallback;

  // define serializer and deserializer
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  // Configure Google authentication for this application
  passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK
    },
    function (accessToken, refreshToken, profile, done) {
      // asynchronous verification
      process.nextTick(function () {
        // attempt to retrieve user by their Google profile
        // email address
        db.Users.find({
          attributes: ['id'],
          where: {
            email: {
              eq: profile._json.email
            }
          }
        }).success(function (user, err) {
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

};
