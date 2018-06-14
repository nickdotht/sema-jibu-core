require('dotenv').config();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');

var index = require('./routes');
var seama_health_check = require('./routes/sema_health_check');
var seama_login = require('./routes/sema_login');
var seama_kiosks = require('./routes/sema_kiosks');
var seama_water_operations = require('./routes/sema_water_operations');
var sema_sales = require('./routes/sema_sales');
var sema_sales_by_channel = require('./routes/sema_sales_by_channel');
var sema_customers = require('./routes/sema_customers');

const winston = require('winston');

const passport = require('passport');
const configurePassport = require('./config/passport');
const { isAuthenticated, isAuthorized } = require('./seama_services/auth_services');

var app = express();

app.use(passport.initialize());
configurePassport();

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

// Use for react
app.use(express.static(path.join(__dirname, 'public_react/build/')));

app.use('/', index);
app.use('/untapped/health-check', seama_health_check);
app.use('/untapped/login', seama_login);
app.use('/untapped/kiosks', seama_kiosks);
app.use('/untapped/water-operations', seama_water_operations);
app.use('/untapped/sales', sema_sales);
app.use('/untapped/sales-by-channel', sema_sales_by_channel);
app.use('/sema/site/customers', sema_customers);

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

// Version
app.set('sema_version', '0.0.0.7');

module.exports = app;
