var server;
var express = require('express'),
    http = require('http'),
    config = require('./config/environment');
db = require('./app/models');
async = require('async');


var app = express();
// configure app
require('./config/express')(app, config);
// routes
require('./config/routes')(app, config);

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

// Snyc database and initialize server.
if (config.nodeEnv !== 'test') {
    db
        .sequelize
        .sync(config.sync)
        .complete(function(err) {
            if (err) {
                throw err[0]
            } else {
                initServer();
            }
        });
}
// Tests require a fresh database.  We cannot drop tables
// without removing the foreign key constraints.
else {
    db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
        .then(function(){
            return db.sequelize.sync(config.sync);
        })
        .then(function(){
            return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
        })
        .then(function(){
            console.log('Database synchronised.');
            initServer();
        }, function(err){
            console.log(err);
        });
}

function initServer() {
    // avoids annoying error message when testing.
    if (server !== undefined) {
        server.close();
    }
    // Uncomment the following lines when not running the server
    // from within the IDE.
    server = http.createServer(app).listen(config.port, function(){
        console.log('Express server listening on port ' + config.port)
    })

}
// This is needed when running from IDE
module.exports = app;
