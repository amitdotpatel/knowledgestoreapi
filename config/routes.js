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
    app.post('/users/logIn', authUser, users.HandleSuccessfulLogin);
    app.post('/users/forgotPass', users.forgotPass);
    app.post('/logOut', authUser, users.logout);
    app.post('/users/signUp', users.create);
    app.get('/users/:userId', authUser, users.get);
    app.get('/users/activate/:uniqueUserId', users.activate);
    app.param('userId', users.user);
    app.param('uniqueUserId', users.activateCodeUser);

    //course APIs
    app.get('/courses', courses.index)
    app.get('/courses/my', authUser, courses.userCourses)
    app.post('/courses', authUser, courses.create)
    app.get('/courses/:courseID', courses.get)
    app.put('/courses/:courseID', authUser, courses.update)
    app.del('/courses/:courseID', authUser, courses.delete)
    app.get('/courseMaterial/:courseID/byDay', authUser, courses.loadCourseMaterialByDay)
    app.param('courseID', courses.load)

}
