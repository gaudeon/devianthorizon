// Load all the things
var express      = require('express'),
    path         = require('path'),
    favicon      = require('serve-favicon'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    routes       = require('./server/routes/index'),
    mongoose     = require('mongoose'),
    config       = require('./server/src/config'),
    app          = express(),
    http         = require('http').Server(app);
    
// enable trust proxy so req.ip works
app.enable('trust proxy');

// connect to the db server:
mongoose.connect('mongodb://' + config.mongo_host + '/' + config.mongo_db);
mongoose.connection.on('open', function() {
    // Connected to Mongoose...
});

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
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.cookie_secret)); // use cookie_secret for signed cookies
app.use(express.static(path.join(__dirname, 'public')));

// our App
app.use(function(req, res, next){
    var ServerApp = require('./server/src/app')(app, http, req, res);
    next();
});

// routes    
app.use('/', routes);

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

module.exports = {
    app  : app,
    http : http
};
