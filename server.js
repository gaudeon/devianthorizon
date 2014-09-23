var express = require('express');
var path    = require('path');
var favicon = require('serve-favicon');
var logger  = require('morgan');

var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var io = require('socket.io')(app);

var routes = require('./server/routes/index');
var mud    = require('./server/src/mud');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
var exphbs = require('express-handlebars');
app.engine('html', exphbs({ 
    extname       : '.html', 
    defaultLayout : 'main',
    layoutsDir    : path.join(__dirname, 'server/views/layouts'),
    partialsDir   : path.join(__dirname, 'server/viewsi/partials') 
}));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// socket io
var world = io
  .of('/world')
  .on('connection', function (socket) {
      // Connected to world
      // Use mud.world here
  });

var login = io
    .of('/login')
    .on('connection', function(socket) {
        // Connected to login
        // Use mud.login here
        socket.on('connect', function(data) {
            console.log('client connected to login');
        });
    });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            layout  : 'error',
            message : err.message,
            error   : err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        layout  : 'error',
        message : err.message,
        error   : {}
    });
});


module.exports = app;
