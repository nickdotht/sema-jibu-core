require('dotenv').config();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');

var index = require('./routes/index');
var seama_health_check = require('./routes/sema_health_check');
var seama_login = require('./routes/sema_login');
var seama_kiosks = require('./routes/sema_kiosks');
var seama_water_operations = require('./routes/sema_water_operations');
var sema_sales = require('./routes/sema_sales');
var sema_sales_by_channel = require('./routes/sema_sales_by_channel');
var session = require('express-session');
var dbService = require('./seama_services/db_service').dbService;
const winston = require('winston');

var app = express();

app.use(
	session({
		secret: 'seama-secret-token',
		cookie: { maxAge: 45000, secure: false, rolling: true }
	})
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());

// Use for static html
//app.use(express.static(path.join(__dirname, 'public')));

// Use for react
app.use(express.static(path.join(__dirname, 'public_react/build/')));

app.use('/', index);
app.use('/untapped/health-check', seama_health_check);
app.use('/untapped/login', seama_login);
app.use('/untapped/kiosks', dbService, seama_kiosks);
app.use('/untapped/water-operations', dbService, seama_water_operations);
app.use('/untapped/sales', dbService, sema_sales);
app.use('/untapped/sales-by-channel', dbService, sema_sales_by_channel);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// ------------Seam development ---------------
// For development, return mock data rather than DB access
app.set('mockIt', false);

// Version
app.set('sema_version', '0.0.0.7');


module.exports = app;
