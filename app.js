/**
 * Starting point of the app
 */

var express = require('express')
    , fs = require('fs');

var app = express();

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
})

var routes = require('./config/routes')
  , middleWares = require('./config/middleWares')
  , appSettings = require('./config/appSettings')
  , http = require('http')
  , passport = require('passport')
  , env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , mongoose = require('mongoose')
  ;


// Bootstrap db connection
mongoose.connect(config.db);

// bootstrap passport config
require('./config/passport')(passport, config);

appSettings(app);

middleWares(app, config, express, passport);

routes(app, passport);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
