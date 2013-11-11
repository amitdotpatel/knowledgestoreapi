
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
      authUser : express.basicAuth(function(email, pass, callback) {
          //var result = (user === 'testUser' && pass === 'testPass');
          console.log('in basic auth')
          User.findOne({ email: email, active: true }, function (err, user) {
              if (err) {
                  console.log('in err');
                  return callback(err) }
              if (!user) {
                  console.log('in not user');
                  return callback(null)
              }
              if (!user.authenticate(pass)) {
                  console.log('in bad pass');
                  return callback(null)
              }

              return callback(null, user);
          })



      })



    }
    return auth;
    //return authenticateUser;

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
