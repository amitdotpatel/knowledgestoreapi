/**
 * Starting point of the app
 */

/*
* TODO - these are application level todos - 1. logging, 2. error handling,
*
* */

var express = require('express')
    , fs = require('fs');

var app = express();

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
})

//setting up environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var routes = require('./config/routes')
  , middleWares = require('./config/middleWares')
  , http = require('http')
  , config = require('./config/config')[process.env.NODE_ENV]
  , mongoose = require('mongoose');


//app settings
app.set('port', config.port);

mongoose.connect(config.db);

middleWares(app, config, express);

routes(app, express);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


