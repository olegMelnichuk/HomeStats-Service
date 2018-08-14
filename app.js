var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var config = require('config');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var dbConfig = config.get('dbAccess');

var uri = 'mongodb://localhost:27017/' + dbConfig.dbName;
var options = {
    //autoIndex: false, // Don't build indexes
    //reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    //reconnectInterval: 500, // Reconnect every 500ms
    //poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    //bufferMaxEntries: 0,
    //connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    //socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    //family: 4, // Use IPv4, skip trying IPv6
    useNewUrlParser: true,
    user: dbConfig.user,
    pass: dbConfig.pass
};
mongoose.connect(uri, options);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;