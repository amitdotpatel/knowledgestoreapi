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
    app.post('/api/users/logIn',
        passport.authenticate('local'), function(req, res){
            res.send('validated locally');
        });


    //user APIs
    app.post('/api/logOut', users.logout);

    app.post('/api/users/signUp', users.create);
    app.get('/api/users/:userId', users.get);
    app.get('/api/users/activate/:uniqueUserId', users.activate);
    app.param('userId', users.user);
    app.param('uniqueUserId', users.activateCodeUser);

    //course APIs
    app.get('/api/courses', courses.index)
    app.get('/api/courses/my', courseAuth, courses.userCourses)
    app.post('/api/courses', courseAuth, courses.create)
    app.get('/api/courses/:courseID', courseAuth, courses.get)
    app.put('/api/courses/:courseID', editCourseAuth, courses.update)
    app.del('/api/courses/:courseID', editCourseAuth, courses.delete)
    app.get('/api/courseMaterial/:courseID/byDay', courseAuth, courses.loadCourseMaterialByDay)
    app.param('courseID', courses.load)

}
