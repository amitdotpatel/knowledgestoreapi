
var mongoose = require('mongoose')
    , passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , GitHubStrategy = require('passport-github').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , User = mongoose.model('User')
    , config = require('../config/config');

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
        done(err, user);
    })
})

// local strategy
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        //console.log('in passport local strategy')
        User.findOne({ email: email, active: true }, function (err, user) {
            if (err) {
                console.log('in err');
                return done(err) }
            if (!user) {
                console.log('in not user');
                return done(null, false, { message: 'Unknown user' });
            }
            if (!user.authenticate(password)) {
                console.log('in bad pass');
                return done(null, false, { message: 'Invalid password' });
            }
            return done(null, user);
        })
    }
));

// facebook strategy
passport.use(new FacebookStrategy({
        clientID: config.development.FACEBOOK_APP_ID,
        clientSecret: config.development.FACEBOOK_APP_SECRET,
        callbackURL: 'http://localhost:' + config.development.port + '/users/fbLogIn/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        var query = { email: profile.emails[0].value};
        User.findOne(query, function (err, user) {
            if (err) {
                return done(err);
            }
            //if user is not present, create a new user
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
                    , active: true
                });
                user.save(function (err, user) {
                    if (err) {
                        console.log('Error while saving Facebook User :: ', err);
                    }
                    return done(err, user);
                })
            } else {
                //update the user information with facebook account details
                if(!user.facebook){
                    user.facebook = {
                        id: profile.id
                    };
                    if(!user.active){
                        user.active = true;
                    }
                    user.save(function(err, user){
                        return done(err, user);
                    });
                }
                return done(null, user);
            }
        });
    }
));

//github strategy
passport.use(new GitHubStrategy({
        clientID: config.development.GITHUB_CLIENT_ID,
        clientSecret: config.development.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/users/githubLogin/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        //TODO: email is not available in the profile.
//      //https://github.com/jaredhanson/passport-github/issues/15
        //console.log(profile);
        //currently saving just the login, actual user details not available in profile.
        User.findOne({ 'github.id': profile.id }, function (err, user) {
            if (err) {
                return done(err);
            }
            //if user is not present, create a new user
            if (!user) {
                user = new User({
                    name: profile.username
                    , email: 'n/a'
                    , firstName: profile.username
                    , lastName : 'n/a'
                    , provider: 'github'
                    , github: {
                        'id':profile.id
                    }
                });
                user.save(function (err, user) {
                    if (err) {
                        console.log('Error while saving Github User :: ', err);
                    }
                    return done(err, user);
                })
            } else {
                return done(err, user);
            }
        })
    }
));

// google oauth2 strategy
passport.use(new GoogleStrategy({
        clientID: config.development.GOOGLE_CLIENT_ID,
        clientSecret: config.development.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/users/googleLogin/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        var query = { email: profile.emails[0].value, active: true };
        User.findOne(query, function (err, user) {
            if (err) {
                return done(err);
            }
            //if user is not present, create a new user
            if (!user) {
                user = new User({
                    name: profile.displayName
                    , email: profile.emails[0].value
                    , firstName: profile.name.givenName
                    , lastName : profile.name.familyName
                    , provider: 'google'
                    , google: {
                        'id':profile.id
                    }
                    , active: true
                });
                user.save(function (err, user) {
                    if (err) {
                        console.log('Error while saving Google User :: ', err);
                    }
                    return done(err, user);
                })
            } else {
                if(!user.google){
                    user.google = {
                        id: profile.id
                    }
                    if(!user.active){
                        user.active = true;
                    }
                    user.save(function(err, user){
                        return done(err, user);
                    });
                }
                return done(null, user);
            }
        })
    }
));

module.exports.fbLogin = function (scope) {
    return passport.authenticate('facebook', {scope: scope});
}

module.exports.fbLoginCallback = function () {
    return passport.authenticate('facebook');
};

module.exports.githubLogin = function (scope) {
    return passport.authenticate('github', {scope: scope});
}

module.exports.githubLoginCallback = function () {
    return passport.authenticate('github');
};

module.exports.googleLogin = function (scope) {
    return passport.authenticate('google', {scope: scope});
}

module.exports.googleLoginCallback = function () {
    return passport.authenticate('google');
};

module.exports.login = function () {
    return passport.authenticate('local', {
        failureFlash: true
    });
};
