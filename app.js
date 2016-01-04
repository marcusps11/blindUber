var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var UberStrategy = require('passport-uber').Strategy;
var passport = require('passport');
var expressSession = require('express-session');
var cookieParser = require("cookie-parser");
var request = require('request');
var router = express.Router();
// var posts = express.Router();

var mongoose       = require('mongoose');

mongoose.connect('mongodb://localhost/uber-authentication-app');


// Middleware
app.use( cookieParser() );
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


require("./config/passport")(passport, UberStrategy);

app.get('/auth/uber',
  passport.authenticate('uber'));

app.get('/auth/uber/callback', 
  passport.authenticate('uber', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// LOGOUT
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');

});

// Home page
app.get('/', function(req, res){
  console.log(req.user);
  res.render('layout', {user: req.user});
});



app.listen(3000);