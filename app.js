var server;
var express = require('express'),
    http = require('http'),
    config = require('./config/environment');
    db = require('./app/models');
    async = require('async'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var GOOGLE_CLIENT_ID = "85240803633-rqnjpf9qt2129irc52flfofnu9les0r9.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "uHqX6CXvjNejGd80bnjiiqD9";

var app = express();
// configure app


// Configure Google authentication
passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://libapps.willamette.edu:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // To keep the example simple, the user's Google profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Google account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
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
}

 /*
passport.use(new GoogleStrategy({
        clientID: "85240803633-rqnjpf9qt2129irc52flfofnu9les0r9.apps.googleusercontent.com",
        clientSecret: "j2hf_t1D6IeQQkwCtD8JAIcq",
        returnURL: 'http://libapps.willamette.edu:3000/auth/google/return',
        realm: 'http://libapps.willamette.edu:3000/'
    },
    function(identifier, profile, done) {
        if(profile._json.email === "mspalti@willamette.edu"){
            // find or create user in database, etc
            User.find({ email: profile._json.email }).done(done);
        }else{
            // fail
            done(new Error("Invalid user"));
        }
        // User.findOrCreate({ openId: identifier }, function(err, user) {
        //     done(err, user);
        // });
    }
));
   */

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
