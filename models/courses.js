/*
* purpose - defining schema for a course
*
* TODO -
* 1. implement images
* */

 var mongoose = require('mongoose')
  , config = require('../config/config')[process.env.NODE_ENV]
  , Schema = mongoose.Schema
  , utils = require('../utils/utils')

/**
 * Course Schema
 * TODO - put defaults whenever applicable
 */

var CoursesSchema = new Schema({
  title: {type : String, default : '', trim : true},
  summary: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  vidLink : {type : String, default : ''},
  comments: [{
    body: { type : String, default : '' },
    user: { type : Schema.ObjectId, ref : 'User' },
    createdAt: { type : Date, default : Date.now }
  }],
  tags: {type: []},
  privacy : { type : String, default : 'public' },
  createdAt  : {type : Date, default : Date.now},
  startDate  : {type : Date},
  endDate  : {type : Date},
  duration: {type: Number, default: 0},
  preRequisite : {type: String},
  category : {type: String},
  authors : {type: []},
  level : {type: Number},
  rating : {type: Number},
  courseMaterial : [{
    day: {type: Number, default: 0},
    section : {type: Number},
    topic : {type: Number},
    title: {type : String, default : '', trim : true},
    vidLink: {type : String, default : ''},
    content: {type : String, default : '', trim : true}
  }]
})

/**
 * Validations
 */

CoursesSchema.path('title').validate(function (title) {
  return title.length > 0
}, ' title cannot be blank')

CoursesSchema.path('summary').validate(function (summary) {
  return summary.length > 0
}, ' summary cannot be blank')

CoursesSchema.path('vidLink').validate(function(link){
  return (link == '') ? true : utils.validateVidLink(link)
}, 'Video Link is not valid')

CoursesSchema.path('startDate').validate(function(startDate){
    return true;//(startDate !== null)
}, 'Start Date cannot be blank')


/**
 * Methods
 */

CoursesSchema.methods = {
  /*
  * TODO - implement images
  * */
  uploadAndSave: function (course, cb) {
    return this.save(cb)
  }
}

/**
 * Statics
 */

CoursesSchema.statics = {

  /**
   * Find course by id
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'email firstName lastName')
      .populate('comments.user')
      .exec(cb)
  },

  /**
   * List courses
   */

  list: function (options, cb, populate) {
    console.log('in list');

    var criteria = options.criteria || {}
    var userPopulate = true;
    if(populate !== null){
      if(populate === false){
          userPopulate = false;
      }
    }
    if(userPopulate){
        this.find(criteria)
            .populate('user', 'firstName lastName')
            .sort({'createdAt': -1}) // sort by date
            .exec(cb)

    }
    else{
        this.find(criteria)
            .sort({'createdAt': -1})
            .exec(cb)

    }
  }
}

mongoose.model('Courses', CoursesSchema, 'courses')
