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
  , config = require('../config/config')[process.env.NODE_ENV]

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
    console.log(req);
  var options = {}
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
  course.createdAt = Date.now;

  /* TODO - need to check req body before uploading */

  VaildateCourseMaterial(req, course, function(err){
      if(err){
        res.send(400, err);
      }
      else{
          var self = this;
          if(course.duration){
              course.endDate = utils.createEndDate(course.startDate, course.duration);
          }
          course.uploadAndSave(course, function (err) {
              if (err) {
                  console.log(err);
                  res.send(400, err);
              }
              else{
                  res.send('course created successfully!');
              }
          })
      }
  })


}

/**
 * Update article
 */

exports.update = function(req, res){
  var course = req.course
  course = _.extend(course, req.body);

  /*
  * TODO - need to validate here.
  * We should not allow user to update some fields like createdAt, user, comments, etc.
  * */

    VaildateCourseMaterial(req, course, function(err){
        if(err){
            res.send(400, err);
        }
        else{
            var self = this;
            if(course.duration){
                course.endDate = utils.createEndDate(course.startDate, course.duration);
            }
            course.uploadAndSave(course, function (err) {
                if (err) {
                    console.log(err);
                    res.send(400, err);
                }
                else{
                    res.send('course updated successfully!');
                }
            })
        }
    })
}

/**
 * get particular course
 */

exports.get = function(req, res){

    console.log(' in getCourse ');
    var course = req.course;
    res.send(course.toJSON());
}


/**
 * Delete an article
 */

exports.delete = function(req, res){
  console.log('req.course = '+req.course);
  var course = req.course
  course.remove(function(err){

      //not sure about below syntax
    res.send('deleted successfully');

  })
}


/*
* unused functionality below  ----- for future use
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
            { $push :  { userCourses : { CourseId: req.course.id, state: config.courseState.enrolled } } },
            function (err, doc) {
                if (err)
                {
                    console.log(err)
                    res.send(500, err);
                }
                else{
                    res.send('enrolled successfully');
                }
            });
    }
    catch(exception){
        console.log(exception.error_message());
        res.send(500, exception.error_message());
    }
}

/*
 * validation on course contents -
 * */
VaildateCourseMaterial = function(req, course, cb){
    var err = null;
    var topic, content, vidLink, title, number, section;
    err = []
    for(var i =0; i < course.courseMaterial.length; i++){
        section = course.courseMaterial[i];
        var referenceSectionNumber = section.sectionNumber || (i+1);
        if (!section.sectionNumber){
          err.push('section number is missing for section ' + referenceSectionNumber);
        }
        if ((!section.sectionTitle) && (section.sectionTitle === '')){
          err.push('section title is missing for section ' + referenceSectionNumber);
        }
        for(var j=0; j < section.topics.length; j++){
          topic = section.topics[j];
            content = topic.topicContent;
            vidLink = topic.topicVidLink;
            title  = topic.topicTitle;
            number = topic.topicNumber;
            var referenceTopicNumber = number || (j+1);
            if((!title) || (title === '')){
                err.push('Title can be blank for section : '+ referenceSectionNumber +' topic :' + referenceTopicNumber);
            }
            if (((!vidLink) || (vidLink === '')) && ((!content) || (content === ''))){
                err.push('Either Video Link or Description should be available for section : '+ referenceSectionNumber +' topic :' + referenceTopicNumber);
            }
            if(((vidLink) && (vidLink !== '')) && (!utils.validateVidLink(vidLink))){
                err.push('Video Link is not valid for section : '+ referenceSectionNumber +' topic :' + referenceTopicNumber);
            }
        }
    }
    if(err.length ===0 ){
        err = null
    }
    if (cb){
        cb(err, course);
    }
}


