
var mongoose = require('mongoose')
    , passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , GitHubStrategy = require('passport-github').Strategy
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
        console.log('in passport local strategy')
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
        User.findOne({ 'facebook.id': profile.id }, function (err, user) {
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
                });
                user.save(function (err, user) {
                    if (err) {
                        console.log('Error while saving Facebook User :: ', err);
                    }
                    return done(err, user);
                })
            } else {
                return done(err, user);
            }
        })
    }
));

//github strategy
passport.use(new GitHubStrategy({
        clientID: config.development.GITHUB_CLIENT_ID,
        clientSecret: config.development.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/users/githubLogin/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        //console.log(profile);
        //currently saving just the login, actual user details not available in profile.
        User.findOne({ 'github.id': profile.id }, function (err, user) {
            if (err) {
                return done(err);
            }
            //if user is not present, create a new user
            if (!user) {
                user = new User({
                    name: profile.login
                    , email: profile.login
                    , firstName: profile.login
                    , lastName : profile.login
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

module.exports.login = function () {
    return passport.authenticate('local', {
        failureFlash: true
    });
};
