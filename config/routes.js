/*
* purpose - defining routes
* created on 17 Oct 2013
* */


var home = require('../controllers/home');


module.exports = function(app){

    //home APIs
    app.get('/', home.index);





}
