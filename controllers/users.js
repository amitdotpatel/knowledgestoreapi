
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


/**
 * Create user
 */

exports.create = function (req, res) {
  var user = new User(req.body);
  user.active = false;
  if ((user.hashed_password.length > 0) && (!user.password)){
    user.password = user.hashed_password;
  }
  user.provider = 'local';
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