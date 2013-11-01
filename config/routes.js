var home = require('../controllers/home')
    , courses = require('../controllers/courses')
    , auth = require('../utils/authorization')
    , users = require('../controllers/users')
    ;

var courseAuth =  [auth.requiresLogin]
    , editCourseAuth =  [auth.requiresLogin, auth.course.hasAuthorization]

module.exports = function(app, passport){

    //home APIs
    app.get('/', home.index);

   //Authentication - TODO - need to handle messages properly - particularly failure message
    app.post('/users/logIn',
        passport.authenticate('local'), users.HandleSuccessfulLogin);


    //user APIs
    app.post('/logOut', users.logout);

    app.post('/users/signUp', users.create);
    app.get('/users/:userId', users.get);
    app.get('/users/activate/:uniqueUserId', users.activate);
    app.param('userId', users.user);
    app.param('uniqueUserId', users.activateCodeUser);

    //course APIs
    app.get('/courses', courses.index)
    app.get('/courses/my', courseAuth, courses.userCourses)
    app.post('/courses', courseAuth, courses.create)
    app.get('/courses/:courseID', courseAuth, courses.get)
    app.put('/courses/:courseID', editCourseAuth, courses.update)
    app.del('/courses/:courseID', editCourseAuth, courses.delete)
    app.get('/courseMaterial/:courseID/byDay', courseAuth, courses.loadCourseMaterialByDay)
    app.param('courseID', courses.load)

}
