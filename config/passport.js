
var mongoose = require('mongoose')
    , passport = require('passport')
//    , LocalStrategy = require('passport-local').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , User = mongoose.model('User')
    , config = require('../config/config');

passport.serializeUser(function(user, done) {
    //console.log("Serialize user user ", user);
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    console.log("In passport.deserialize user id = " + id);
    User.findOne({ _id: id }, function (err, user) {
        //console.log("err ", err);
        //console.log("user ", user);
        done(err, user);
    })
})

// use local strategy
/*passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        console.log('in passport local strategy')
        User.findOne({ email: email, active: true }, function (err, user) {
            if (err) {
                console.log('in err');
                return done(err) }
            if (!user) {
                console.log('in not user');
                return done(null, false, { message: 'Unknown user' })
            }
            if (!user.authenticate(password)) {
                console.log('in bad pass');
                return done(null, false, { message: 'Invalid password' })
            }
            return done(null, user)
        })
    }
))*/

passport.use(new FacebookStrategy({
        clientID: config.development.FACEBOOK_APP_ID,
        clientSecret: config.development.FACEBOOK_APP_SECRET,
        callbackURL: 'http://localhost:' + config.development.port + '/users/fbLogIn/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('callback after login accessToken ', accessToken);
        console.log('callback after login refreshToken ', refreshToken);
        console.log('callback after login profile ', profile);
        console.log('callback after login done ', done);

        User.findOne({ 'facebook.id': profile.id }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                user = new User({
                    name: profile.displayName
                    , email: profile.emails[0].value
                    , firstName: profile.name.givenName
                    , lastName : profile.name.familyName
                    , provider: 'facebook'
                    , facebook: {
                        'id':profile.id
                    }
                });
                user.save(function (err, user) {
                    //console.log('err ', err);
                    //console.log('user ', user);
                    if (err) {
                        //console.log('Error while saving Facebook User');
                        //console.log(err);
                    }
                    return done(err, user);
                })
            } else {
                return done(err, user);
            }
        })
    }
));

module.exports.fbLogin = function (scope) {
    return passport.authenticate('facebook', {scope: scope});
}

module.exports.fbLoginCallback = function () {
    return passport.authenticate('facebook');
}
