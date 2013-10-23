/*
* TODO -
* 1. handle and send errors
* */


/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Courses = mongoose.model('Courses')
  , utils = require('../utils/utils')
  , _ = require('underscore')
  , Users = mongoose.model('User')

/*
* rendering course material for a particular day
* */
exports.loadCourseMaterialByDay = function (req, res){
  //the day for which course material needs to be rendered
  var day = req.params.day;
  var course = req.course;

  for(var i = 0; i < course.duration; i++){
     console.log(course.courseMaterial[i].day);
     if (course.courseMaterial[i].day === day){
       var response = {day : day,
         content: course.courseMaterial[i].content,
         vidLink : course.courseMaterial[i].vidLink,
         title: course.courseMaterial[i].title
       };
       res.send(response.toJSON());
       break;
     }
  }
}

/**
 * Load course for the courseID
 */

exports.load = function(req, res, next, id){
  var User = mongoose.model('User')

  Courses.load(id, function (err, course) {
    if (err) return next(err)
      console.log(id);
    if (!course) return next(new Error('not found'))
    req.course = course
    next()
  })
}

/**
 * List
 */

exports.index = function(req, res){
    console.log('in index');
  var sysDate = new Date();
  sysDate.setHours(0,0,0,0);
  var options = {}
    //criteria: {}//{$or : [{endDate: {$gte : sysDate}}, {user:req.user}]}


  Courses.list(options, function(err, courses) {
    if (err) {
       console.log(err.message);
       res.send('err : ' + err.message);
    }
    else{
      console.log('got courses');
      res.send(JSON.stringify(courses));
    }

  })
}

/*
* user's enrolled courses only
* */
exports.userCourses = function (req, res){
    var sysDate = new Date();
    sysDate.setHours(0,0,0,0);
    var self = this;
    var options = {};
    try{
        Users.findById(req.user._id, function(err, user){
            if (err){
                console.log(err)
            }
            else{
                var CurrentUserCourses = [];
                if((user) && (user.userCourses) && (user.userCourses.length))
                    for(var i=0; i < user.userCourses.length; i++)
                    {
                        CurrentUserCourses.push(user.userCourses[i].CourseId)
                    }
                var ObjectId = require('mongoose').Types.ObjectId;
                CurrentUserCourses = CurrentUserCourses.map(function(id) { return ObjectId(id); });
                options.criteria = {_id: {$in: CurrentUserCourses}};


                Courses.list(options, function(err, courses) {
                  res.send(JSON.stringify(courses));
                })
            }
        })
    }
    catch(err){
      console.log(err.message);
    }

}


/**
 * Create a course
 */

exports.create = function (req, res) {
  var course = new Courses(req.body)
  course.user = req.user;

  var self = this;
              if(course.duration){
                  course.endDate = utils.createEndDate(course.startDate, course.duration);
              }
              course.uploadAndSave(course, function (err) {
                  if (!err) {
                    console.log(err);
                  }
                  else{
                      res.send('course created successfully!');
                  }
              })
}

/**
 * Update article
 */

exports.update = function(req, res){
  var course = req.course
  course = _.extend(course, req.body)
           if(course.duration){
               course.endDate = utils.createEndDate(course.startDate, course.duration);
           }

           course.uploadAndSave(course, function(err) {
               if (!err) {
                   console.log(err.message);
               }
               else{
                 res.send('course updated successfully!!');
               }
           })
}

/**
 * get particular course
 */

exports.getCourse = function(req, res){

    console.log(' in getCourse ');
    var course = req.course;
    res.send(course.toJSON());
}


/**
 * Delete an article
 */

exports.deleteCourse = function(req, res){
  console.log('req.course = '+req.course);
  var course = req.course
  course.remove(function(err){

      //not sure about below syntax
    res.redirect('/courses');

  })
}


/*
* unused functionality below
*
* */


/*
 * enroll user for the course
 * */
exports.enroll = function (req, res) {
    try{
        var opts  = {};
        //need to check whether user has already enrolled for this course before pushing
        Users.findByIdAndUpdate(req.user.id,
            { $push :  { userCourses : { CourseId: req.course.id, state: 'enrolled' } } },
            function (err, doc) {
                if (err)
                {
                    console.log(err)
                }
                else{
                    console.log('enrolled successfully')
                }
            });
    }
    catch(exception){
        console.log(exception.error_message())
    }
}

/*
 * get course Material & duration - ToDo - add error while callback, implement in callback as well
 * */
AddCourseMaterial = function (req, course, cb){

    //find duration of the course & set course duration , totalDays
    var duration = Number(course.duration);  //ToDo - remove hardcoding
    //course.duration = duration;
    console.log(course);
    var courseMaterial = [];
    for(var i= 1; i <= duration; i++){
        var index;
        index = i > 9 ? '' + i: '0' + i;

        var title = req.body['title'+index] ? req.body['title'+index] : '';
        courseMaterial.push({day: i,
            content : req.body['descDay'+index],
            vidLink : req.body['vidLink'+index],
            title : req.body['dayTitle'+index]})
    }

    course.courseMaterial = courseMaterial;
    cb(course);
}

/*
 * validation on course contents -
 * ToDo - perhaps, these validations should be implemented in the model, was getting difficulties while implementing that
 * */
VaildateCourseMaterial = function(req, course, cb){
    var err = null;
    var index, content, vidLink, title;
    err = []
    for(var i =1; i <= course.duration; i++){
        index = i > 9 ? '' + i: '0' + i;
        content = req.body['descDay'+index];
        vidLink = req.body['vidLink'+index];
        title  = req.body['dayTitle'+index];
        if(title === ''){
            err.push('Title can be blank for day :' + i.toString());
        }
        if ((vidLink === '') && (content === '')){
            err.push('Either Video Link or Description should be available for day : ' + i.toString());
        }
        if((vidLink !== '') && (!utils.validateVidLink(vidLink))){
            err.push('Video Link is not valid for day : ' + i.toString());
        }
    }
    if(err.length ===0 ){
        err = null
    }
    if (cb){
        cb(err, course);
    }
}



exports.checkDateRange = function(course){
    return checkDateRange(course);
}


checkDateRange = function(course){
    var sysDate = new Date();
    var courseDate = new Date(course.startDate.getTime());
    sysDate.setHours(0, 0, 0, 0);
    courseDate.setHours(0, 0, 0, 0);
    var dateCompare;
    dateCompare = 0;
    if (sysDate < courseDate){
        dateCompare = 1
    }
    else
    {
        var courseEndDate = new Date(courseDate.getTime()+ ((1000 * 60 * 60 * 24) * course.duration-1));
        console.log(courseEndDate);
        if (sysDate > courseEndDate){
            dateCompare = 1
        }
    }
    var inCourseRange;
    if (dateCompare === 0){
        inCourseRange = true
    }
    else{
        inCourseRange = false;
    }

    return inCourseRange;
}

exports.checkEnrollStatus = function(req,course){
    return checkEnrollStatus(req, course);
}

checkEnrollStatus = function(req,course){
    var enrollState = false;
    if(!req.user){
        return enrollState;
    }
    var userCourses = req.user.userCourses;
    var currentCourseId = course._id;

    var sysDate = new Date();
    var courseDate = new Date(course.startDate.getTime());
    sysDate.setHours(0, 0, 0, 0);
    courseDate.setHours(0, 0, 0, 0);
    var dateCompare;
    dateCompare = 0;
    var courseEndDate = new Date(courseDate.getTime()+ ((1000 * 60 * 60 * 24) * course.duration-1));
    console.log(courseEndDate);
    if (sysDate > courseEndDate){
        dateCompare = 1
    }

    for(var i=0; i< userCourses.length; i++){
        if((currentCourseId == userCourses[i].CourseId) || (dateCompare == 1)){
            console.log(currentCourseId + " " + userCourses[i].CourseId);
            enrollState = true;
        }
    }

    return enrollState;
}
