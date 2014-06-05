process.env.NODE_ENV = 'development';

var express = require('express'),
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

db
    .sequelize
    .sync({ force: false })
    .complete(function(err) {
        if (err) {
            throw err[0]
        } else {
         //   http.createServer(app).listen(app.get('port'), function(){
         //       console.log('Express server listening on port ' + app.get('port'))
         //   })
        }
    });

//app.listen(config.port);
module.exports = app;

