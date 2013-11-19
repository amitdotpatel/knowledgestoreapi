var home = require('../controllers/home')
    , courses = require('../controllers/courses')
    , users = require('../controllers/users')
    ;


module.exports = function(app, express){
    var BasicAuth = require('../utils/authorization')(express);
    var authUser = BasicAuth.authUser;

    //home APIs
    app.get('/', function(req, res, next){
        console.log('####################################### /');
        console.log('/ ' + req.headers.cookie);
        console.log('#######################################');
        home.index(req, res, next);
    });

    //user APIs
    app.get('/users/fbLogIn', function(req, res, next){
        console.log('users/fbLogin ' + req.headers.cookie);
        console.log('users/fbLogin user =  ' + req.user);
        if(req.user){
            res.redirect('http://localhost:8080/');
        } else {
            users.fbLogin(req, res, next);
        }
    });
    app.get('/users/fbLogIn/callback', users.fbLoginCallback, function(req, res){
        console.log('users/fbLogin/callback user =  ' + req.user);
        //console.log('callback success req = ', req);
        //redirect this to callback url provided, default would be the standard kinoedu URL
        //currently assuming the default to be localhost:8080
        console.log('####################################### fblogin callback');
        console.log('users/fbLogin/callback ' + req.headers.cookie);
        console.log('#######################################');
        res.redirect('http://localhost:8080/api/users/fbLogin');
        //res.send('Hi ! ' + req.user);
    });
    app.post('/users/logIn', authUser, users.HandleSuccessfulLogin);
    app.post('/users/forgotPass', users.forgotPass);
    app.post('/logOut', authUser, users.logout);
    app.post('/users/signUp', users.create);
    app.get('/users/:userId', authUser, users.get);
    app.get('/users/activate/:uniqueUserId', users.activate);
    app.param('userId', users.user);
    app.param('uniqueUserId', users.activateCodeUser);

    //course APIs
    app.get('/courses', function(req, res, next){
        console.log('/courses user = ' + req.user);
        courses.index(req, res, next);
    });
    app.get('/courses/my', authUser, courses.userCourses);
    app.post('/courses', authUser, courses.create);
    app.get('/courses/:courseID', courses.get);
    app.put('/courses/:courseID', authUser, courses.update);
    app.del('/courses/:courseID', authUser, courses.delete);
    app.get('/courseMaterial/:courseID/byDay', authUser, courses.loadCourseMaterialByDay);
    app.param('courseID', courses.load);

}
