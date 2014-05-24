var express = require('express');

var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http  = require('http');
var db  = require('./models');
var routes = require('./routes');
var tags = require('./routes/tags');
var collection = require('./routes/collection');
var tagMVCView = require('./routes/tagView');
var mvcTags = require('./routes/mvcTags');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/tag/remove', tags.remove);
app.use('/tag/update', tags.update);
app.use('/tag/create', tags.create);
app.use('/mvc/tag/view', tagMVCView.index);
app.use('/mvc/tag/create', mvcTags.create);
app.use('/collection/create', collection.create);
app.use('/collection/update', collection.update);
app.use('/collection/remove', collection.remove);

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
    .sync({ force: true })
    .complete(function(err) {
        if (err) {
            throw err[0]
        } else {
         //   http.createServer(app).listen(app.get('port'), function(){
         //       console.log('Express server listening on port ' + app.get('port'))
         //   })
        }
    });


module.exports = app;

