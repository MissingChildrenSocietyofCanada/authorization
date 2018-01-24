// server.js
var express = require('express');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var app = express();
var port = process.env.PORT || 8080;

var configDB = require('./config/database.js');
const appInsights = require("applicationinsights");

appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
	.setAutoCollectDependencies(true)
	.setAutoCollectConsole(true, true)
	.setUseDiskRetryCaching(true)
    .start();

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(express.static('public'));//Static Content

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);