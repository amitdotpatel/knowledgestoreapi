
/*
 *  utility functions required for authentication and authorization
 */



exports.requiresLogin = function (req, res, next) {
//    if (!req.isAuthenticated()) {
//        return res.redirect('/login')
//    }
    next()
}

/*
 *  User authorization routing middleware
 */

exports.course = {
    hasAuthorization : function (req, res, next) {
//        if (req.profile.id != req.user.id) {
//            //req.flash('info', 'You are not authorized')
//            return res.redirect('/users/'+req.profile.id)
//        }
        next()
    }
}
