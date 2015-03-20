var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var facebookAuth = require("./services/facebookAuth.js");
var googleAuth = require("./services/googleAuth.js");
var LocalStrategy = require('./services/localStrategy.js');
var createSendToken = require('./services/jwt.js');
var jwt = require('jwt-simple');
var jobs = require('./services/jobs.js');
var emailVerification = require('./services/emailVerification.js');

var app = express();

app.use(bodyParser.json());
app.use(passport.initialize());

passport.serializeUser(function(user,done){
    done(null,user.id);
});

app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','http://localhost:9000');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type, Authorization');
    
    next();
});

passport.use('local-register',LocalStrategy.register);
passport.use('local-login',LocalStrategy.login);

app.get('/jobs', jobs);

app.post('/register',passport.authenticate('local-register'),function(req,res){
    emailVerification.send(req.user.email);
    createSendToken(req.user, res);        
});

app.get('/auth/verifyEmail', emailVerification.handler);

app.post('/login',passport.authenticate('local-login'),function(req,res){    

    createSendToken(req.user, res);    

});

app.post('/auth/facebook', facebookAuth);

app.post('/auth/google', googleAuth);

mongoose.connect( 'mongodb://localhost/psjwt', function(err) { if (err) console.log(err); } );

var server = app.listen(3000, function(){
    console.log('api listening on', server.address().port);
});