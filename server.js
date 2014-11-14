var server;

var express = require('express'),
    session = require('express-session'),
    http = require('http'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

config = require('./config/environment');
db = require('./app/models');
async = require('async');


var GOOGLE_CLIENT_ID = config.googleClientId;
var GOOGLE_CLIENT_SECRET = config.googleClientSecret;
var GOOGLE_CALLBACK = config.googleCallback;

var app = express();

// configure app
app.use(session({secret: 'keyboard cat', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());

// passport used for Google OAuth2
// define serializer and deserializer
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Configure Google authentication
passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification
        process.nextTick(function () {
            // look up user by Google profile email
            db.Users.find({ attributes: ['id'],
                where: {
                    email: {
                        eq: profile._json.email
                    }
                }
            }).success( function (user, err) {
                // if email lookup succeeded, pass the user id to the passport callback
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

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
app.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
};

require('./config/express')(app, config);
// routes
require('./config/routes')(app, config, passport);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
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
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
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

    // avoids annoying error message when testing.
    if (server !== undefined) {
        server.close();
    }
    server = http.createServer(app).listen(config.port, function(){
        console.log('Express server listening on port ' + config.port)
    })

}

// This is needed when running from IDE
module.exports = app;
