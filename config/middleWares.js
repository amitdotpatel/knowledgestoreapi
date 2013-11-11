/*
* purpose - defining all middlewares
* created on 17 Oct 2013
* */

var path = require('path')


module.exports = function(app, config, express){

    var mongoStore = require('connect-mongo')(express);

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser())

    //router comes last
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    // development only
    if ('development' == process.env.NODE_ENV) {
        app.use(express.errorHandler());
    }



}
