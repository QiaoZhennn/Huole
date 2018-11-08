'use strict';

require('dotenv').config();

var express = require('express');
const mongoose = require("mongoose");
mongoose.connect(process.env.mongoURI);


var app = express();

var port = process.env.PORT || 8000;

// Add headers
app.use(function (req, res, next) {
  var allowedOrigins = ['http://localhost:3000', 'http://huole.huobidev.com'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./faucet')(app);


require('./models/Post');
require('./post')(app);

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
