knowledgestoreapi
=================

Kinoedu API

Instructions : 

1. Check out the code.
2. In the knowledgestoreapi folder, execute npm install
3. In the same folder, execute node app.js


Routes : 

    get : '/', use : home page - just to test api is up :) , output : string - crude

    post : '/users/logIn', use : login user, params : email, password, output : String result
    get : '/users/fbLogIn', login with facebook
    get : '/users/fbLogIn/callback', login with facebook's callback
    post : '/users/logIn', use : login user, params : email, password, output : JSON - user
    post : '/logOut', use : log out the session
    post : '/users/signUp', use : sign up, params : email, password, firstName, lastName, etc, output : String result
    get : '/users/:userId', use : get particular user
    post : '/users/forgotPass', use : reset password, params : email
    get : '/users/activate/:uniqueUserId', use: to activate the user
    post : '/users/changePass', use : change the password, params : currentPass, newPass

    get : '/courses', use : list of courses, output - JSON array
    get : '/courses/my', use : user specific courses, output - JSON array
    post : '/courses', use - creation of courses, params : title, summary, etc, output : String 
    get : '/courses/:courseID', use : get particular course, output: JSON
    put : '/courses/:courseID', use : edit particular course
    del : '/courses/:courseID', use : delete a course
    post : '/courses/enroll/:courseID', use : enroll current user for the course

