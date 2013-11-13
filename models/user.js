
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , _ = require('underscore')
  , config = require('../config/config')[process.env.NODE_ENV]
  , authTypes = ['github', 'twitter', 'facebook', 'google'];

/**
 * User Schema
 */

var UserSchema = new Schema({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  email: { type: String, default: '' },
  provider: { type: String, default: '' },
  hashed_password: { type: String, default: '' }, //hashed password
  salt: { type: String, default: '' },
  authToken: { type: String, default: '' },
  facebook: {},
  twitter: {},
  github: {},
  google: {},
  userCourses : [{
      CourseId: {type: Schema.Types.ObjectId, ref : 'Courses'},
      state: {type : Number, default : 1}
  }],
  active : {type: Boolean, default: false}, //activation will make active = true
  activateCode : {type: Schema.Types.ObjectId},
  activationCodeUsed : {type: Boolean},
  disabled: {type: Boolean, default: false},//administrator can make this true for some reason
  createdBy: {type: Schema.Types.ObjectId}

})

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password })

/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length
}

// the below 4 validations only apply if you are signing up traditionally

UserSchema.path('firstName').validate(function (firstName) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true
  return firstName.length
}, 'First Name cannot be blank')

UserSchema.path('email').validate(function (email) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true
  return email.length
}, 'Email cannot be blank')

UserSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User')

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(err || users.length === 0)
    })
  } else fn(true)
}, 'Email already exists')

UserSchema.path('lastName').validate(function (lastName) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true
  return lastName.length
}, 'Last Name cannot be blank')

UserSchema.path('hashed_password').validate(function (hashed_password) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true
  return hashed_password.length
}, 'Password cannot be blank')


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next()

  if (!validatePresenceOf(this.password)
    && authTypes.indexOf(this.provider) === -1)
    next(new Error('Invalid password'))
  else
    next()
})


/*
* statics
*
* */

UserSchema.statics = {

   getCourses : function (id){
     var Courses = [];
     this.findById(id, function(err, user){
         if (err){
            console.log(err)
         }
         else{
             if((user) && (user.userCourses) && (user.userCourses.length))
             for(var i=0; i < user.userCourses.length; i++)
             {
                 Courses.push(user.userCourses[i].CourseId)
             }
         }
     })
     return Courses;
   },

   load : function(id, cb){
     this.findOne({_id: id})
         .populate('userCourses.CourseId')
         .exec(cb)
   }

}

var prepareForObject  = function(doc, ret, options){
    if ('function' == typeof doc.ownerDocument) {
        //not to handle sub-doc
    }
    else{
        console.log('in transform');
        delete ret.hashed_password;
        delete ret.activateCode;
        delete ret.activationCodeUsed;
        delete ret.salt;
        delete ret.authToken;
        //not sure about below
        delete ret.facebook;
        delete ret.twitter;
        delete ret.github;
        delete ret.google;
    }
}
UserSchema.set('toJSON', { transform : prepareForObject});






/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   */

  authenticate: function (plainText) {
    return ((this.encryptPassword(plainText) === this.hashed_password)
        && (this.active) && (!this.disabled))
  },

  /**
   * Make salt
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },

  /**
   * Encrypt password
   */

  encryptPassword: function (password) {
    if (!password) return ''
    var encrypred;
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
      return encrypred
    } catch (err) {
      return ''
    }
  }
}

mongoose.model('User', UserSchema, 'users')
