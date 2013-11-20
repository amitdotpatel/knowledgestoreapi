var home = require('../controllers/home')
    , courses = require('../controllers/courses')
    , users = require('../controllers/users')
    ;


module.exports = function(app, express){
    var BasicAuth = require('../utils/authorization')(express);
    var authUser = BasicAuth.authUser;

    //home APIs
    app.get('/', home.index);

    //user APIs
    app.get('/users/fbLogIn', function(req, res, next){
        if(req.user){
            res.redirect('http://localhost:8080/');
            //res.send(200, "Already logged in");
        } else {
            users.fbLogin(req, res, next);
        }
    });
    app.get('/users/fbLogIn/callback', users.fbLoginCallback, function(req, res){
        //redirect this to callback url provided, default would be the standard kinoedu URL
        //currently assuming the default to be localhost:8080
        res.redirect('http://localhost:8080/');
        //console.log(res);
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
