
/**
 * Module dependencies.
 */

/*
* TODO - 1. Handle errors
* */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , utils = require('../utils/utils')
  , config = require('../config/config')[process.env.NODE_ENV]
  , emailer = require('../utils/emailer')
  ;

var app_user = {};

/**
 * Logout
 * TODO - need to test login - logout with UI
 */

exports.logout = function (req, res) {
  req.logout();
  res.send('logged out successfully');
}

/*
* handle successful authentication
* */
exports.HandleSuccessfulLogin = function(req, res){
    res.send('Login successful ');
}

/*
* forgot password
* */
exports.forgotPass = function(req, res){
  var userEmail = req.body.email;
  //find the user
  User.findOne({email:userEmail}, function(err, user){
    if (err){
      res.send(400, err);
    }
    else{
        //reset the password
      if(!user){
        return res.send(400, 'email not valid');
      }

      user.password = utils.getRandomPass(); //'randompass'; //create the random pass
      user.save(function(err){
          if (err){
              res.send(400, err);
          }
          else{
            //send the email to the user
            emailer.sendChangePassMail(user);
            res.send('Password has been reset successfully');
          }
      })
    }
  });
}


/**
 * Create user
 */

exports.create = function (req, res) {
  var user = new User(req.body);
  //initiate the user, NOTE - we will overwrite these values as those should be set for new user.
  user.active = false;
  user.provider = 'local';
  user.disabled = false;
  if(req.user){
      user.createdBy = req.user._id;
  }


  if ((user.hashed_password.length > 0) && (!user.password)){
    user.password = user.hashed_password;
  }

  /*
  * TODO - with below approach activatecode and _id differs only by 1 digit
  * need to make it random
  * */

  user.activateCode = new mongoose.Types.ObjectId;
  user.save(function (err) {
    if (err) {
        res.send(400, err);
    }
    else{

        res.send('created successfully');
        emailer.sendEmail(user);

    /*
    * NOTE - above code is just creating user without verifying the email
    * if we need to validate the email and take action if email is not proper
    * implement below code
    * */

//        emailer.sendEmail(user, function(err, ResultCode){
//            if(err){
//                user.remove(function(err){});
//                data = {errors:{InvalidEmail:{type:'invalid email'}}};
//                res.send(400, data);
//
//            }
//            else{
//              res.send('created successfully');
//            }
//        });

    }
  })
}

/**
 *  Show profile
 */

exports.get = function (req, res) {
  var user = req.profile;
  res.send(user.toJSON());
}

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}


/*
* find user by unique id
* */


exports.activateCodeUser = function(req, res, next, id){
  User
      .findOne({activateCode: id})
      .exec(function(err, user){
       console.log('got user by unique id');
       if (err) return next(err)
       if (!user) return next(new Error('Failed to load User ' + id))
       req.profile = user
       next();
      })
}


/*
* activate user
* */

exports.activate = function(req, res){
  console.log('in activate user');
  var user = req.profile;
  if(user.activationCodeUsed){
    return res.send('Sorry. This activation code has already been used.');
  }
  else{
      user.active = true;
      user.activationCodeUsed = true;
      user.save(function(err, users, noOfUpdates){
          if (err) throw err;
          console.log('activated successfully');
          res.send('activation successful');
      })
  }
}