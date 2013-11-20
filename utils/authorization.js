
/*
 *  utility functions required for authentication and authorization
 *  TODO - need to implement this in future
 */

var mongoose = require('mongoose')
    , User = mongoose.model('User');


/*
* test req header
 authorization
 Basic am9hb2plcm9uaW1vOmJsYWJsYWJsYQ==dxc
* */

module.exports = function(express){

    var auth = {
      authUser : function(req, res, next){
          if(req.user){
              next(null);
          } else {
              res.send(401, "Unauthorized");
          }
      }
    }
    return auth;
};

//exports.basicAuth = this.authenticateUser;

//exports.requiresLogin = function (req, res, next) {
//    if (!req.isAuthenticated()) {
//        return res.redirect('/login')
//    }
//    next()
//}

/*
 *  User authorization routing middleware
 */

//exports.course = {
//    hasAuthorization : function (req, res, next) {
//        if (req.profile.id != req.user.id) {
//            //req.flash('info', 'You are not authorized')
//            return res.redirect('/users/'+req.profile.id)
//        }
//        next()
//    }
//}
