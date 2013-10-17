/**
 * Starting point of the app
 */

var express = require('express')
  , routes = require('./config/routes')
  , middleWares = require('./config/middleWares')
  , appSettings = require('./config/appSettings')
  , http = require('http')
  ;

var app = express();

appSettings(app);

middleWares(app, express);

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
