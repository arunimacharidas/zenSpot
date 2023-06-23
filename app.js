const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expresslayouts = require('express-ejs-layouts')
const mongoose=require('mongoose')
const adminRouter = require('./routes/admin');
const  usersRouter = require('./routes/users');
const session =require('express-session')
require('./models/connection')
const bodyParser = require('body-parser')
const app = express();



app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'ejs');

app.set('layout','layouts/user-layout');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expresslayouts)



app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public/')));

app.use(session({
  secret:'key',
  saveUninitialized:false,
  cookie:{
    maxAge: 1000*60*60*24*10
  },
  resave:false
}))

app.use(function nocache (req,res,next){
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
})


app.use('/', usersRouter);
app.use('/admin', adminRouter);


app.use(function(err, req, res, next) {
 
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
