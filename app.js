var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var handlebars = require('express-handlebars');
var routes = require('./routes/route');
// var userRoute = require('./routes/user_route');
var credentials = require('./credentials');

var app = express();


// Connect mongodb
var opts = {
  server: {
    socketOptions: {
      keepAlive: 1
    }
  }
};
switch (app.get('env')) {
  case 'development':
    mongoose.connect(credentials.development.connectionString, opts);
    break;
  case 'production':
    mongoose.connect(credentials.production.connectionString, opts);
    break;
  default:
    throw new Error('Unknown execution environment: ' + app.get('env'));
}
/*var dbUrl = 'mongodb://localhost/BlogWebApp';
mongoose.connect(dbUrl);*/

var dbMongo = mongoose.connection;
dbMongo.on('error', console.error.bind(console, 'connection error:'));

dbMongo.once('open', function() {
  console.log('Mongodb connected');
});



// view engine setup
app.engine('.hbs', handlebars({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    section: function(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(session({
  secret: 'BlogWebApp',
  saveUninitialized: true,
  resave: false
}));

app.use('/', routes);
// app.use('/:username', userRoute);

/*var sess;
route(app, sess);*/


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not found');
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
      error: err
    });
});


module.exports = app;