
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Course = mongoose.model('Courses')

/**
 * List courses tagged with a tag
 */


exports.indexCourses = function (req, res) {
    var criteria = { tags: req.param('tag')};
    var options = {
        criteria: criteria
    }
    Course.list(options, function(err, courses) {
        if (err) throw err;
        res.send(JSON.stringify(courses));
    })
}