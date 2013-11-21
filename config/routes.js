var home = require('../controllers/home')
    , courses = require('../controllers/courses')
    , users = require('../controllers/users')
    ;


module.exports = function(app, express){
    var BasicAuth = require('../utils/authorization')(express),
    utils = require('../utils/utils');
    var authUser = BasicAuth.authUser;

    //home APIs
    app.get('/', home.index);

    //user APIs
    //login with facebook
    app.get('/users/fbLogIn', function(req, res, next){
        var redirectUrl = utils.getRedirectUrl(req);
        if(req.user){
            res.redirect(redirectUrl);
        } else {
            users.fbLogin(req, res, next, redirectUrl);
        }
    });
    app.get('/users/fbLogIn/callback', users.fbLoginCallback, function(req, res){
        var state = req.query.state;
        if(!!!state){
            state = req.connection.remoteAddress;
        }
        //redirect this to callback url provided, default would be the standard kinoedu URL
        res.redirect(state);
        //console.log(res);
    });

    //login with github
    app.get('/users/githubLogIn', function(req, res, next){
        var redirectUrl = utils.getRedirectUrl(req);
        if(req.user){
            res.redirect(redirectUrl);
            //res.send(200, "Already logged in");
        } else {
            users.githubLogin(req, res, next, redirectUrl);
        }
    });
    app.get('/users/githubLogin/callback', users.githubLoginCallback, function(req, res){
        var state = req.query.state;
        console.log('github state = ' + state);
        if(!!!state){
            state = req.connection.remoteAddress;
        }
        //redirect this to callback url provided, default would be the standard kinoedu URL
        res.redirect(state);
        //console.log(res);
    });

    //login with google
    app.get('/users/googleLogIn', function(req, res, next){
        var redirectUrl = utils.getRedirectUrl(req);
        if(req.user){
            res.redirect(redirectUrl);
            //res.send(200, "Already logged in");
        } else {
            users.googleLogin(req, res, next, redirectUrl);
        }
    });
    app.get('/users/googleLogin/callback', users.googleLoginCallback, function(req, res){
        var state = req.query.state;
        if(!!!state){
            state = req.connection.remoteAddress;
        }
        console.log('google callback state = ' + req.query.state);
        //redirect this to callback url provided, default would be the standard kinoedu URL
        res.redirect(req.query.state);
        //console.log(res);
    });
    app.get('/user/current', function(req, res){
        if(req.user){
            res.send(200, req.user);
        } else {
            res.send(401, "Not authorized");
        }
    });
    app.post('/users/logIn', users.login, users.HandleSuccessfulLogin);
    app.post('/users/forgotPass', users.forgotPass);
    app.get('/logOut', authUser, users.logout);
    app.post('/users/signUp', users.create);
    app.get('/users/:userId', /*authUser,*/ users.get);
    app.get('/users/activate/:uniqueUserId', users.activate);
    app.post('/users/changePass', authUser, users.changePass);
    app.param('userId', users.user);
    app.param('uniqueUserId', users.activateCodeUser);

    //course APIs
    app.get('/courses', function(req, res, next){
        //console.log('req.header = ' + req.headers);
        courses.index(req, res, next);
    })
    app.get('/courses/my', authUser, courses.userCourses)
    app.post('/courses', authUser, courses.create)
    app.get('/courses/:courseID', courses.get)
    app.put('/courses/:courseID', authUser, courses.update)
    app.del('/courses/:courseID', authUser, courses.delete)
    app.post('/courses/enroll/:courseID', authUser, courses.enroll);
    app.param('courseID', courses.load)

}
