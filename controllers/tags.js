
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Course = mongoose.model('Courses')
  , Article = mongoose.model('Article')
  , CoursesModule = require('./courses')

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  var criteria = { tags: req.param('tag') }
  var perPage = 5
  var page = req.param('page') > 0 ? req.param('page') : 0
  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  }

  Article.list(options, function(err, articles) {
    if (err) return res.render('500')
    Article.count(criteria).exec(function (err, count) {
      res.render('articles/index', {
        title: 'Articles tagged ' + req.param('tag'),
        articles: articles,
        page: page,
        pages: count / perPage
      })
    })
  })
}


exports.indexCourses = function (req, res) {
    var sysDate = new Date();
    sysDate.setHours(0,0,0,0);

    var criteria = { tags: req.param('tag'), $or : [{endDate: {$gte : sysDate}}, {user:req.user}] };
    var perPage = 5
    var page = req.param('page') > 0 ? req.param('page') : 0
    var options = {
        perPage: perPage,
        page: page,
        criteria: criteria
    }

    Course.list(options, function(err, courses) {
        if (err) return res.render('500')

        var isValidDateRangeArr, isEnrolledArr;
        isValidDateRangeArr = new Array();
        isEnrolledArr = new Array();
        if (!req.user){
            for(var i=0 ; i<courses.length;i++){
                isValidDateRangeArr[i] = false;
                isEnrolledArr[i] = true;
            }
        }
        else{
            for(var i=0 ; i<courses.length;i++){
                isValidDateRangeArr[i] = CoursesModule.checkDateRange(courses[i]);
                isEnrolledArr[i] = CoursesModule.checkEnrollStatus(req,courses[i]);
            }
        }

        Course.count(criteria).exec(function (err, count) {
            res.render('courses/index', {
                title: 'Courses tagged ' + req.param('tag'),
                articles: courses,
                page: page,
                pages: count / perPage,
                isEnrolled:isEnrolledArr,
                isValidDateRange:isValidDateRangeArr,
                myCourses:false
            })
        })
    })
}