/**
 * Created by abhay on 23/10/13.
 */


var path = require('path')
    , swigEmaileTemplate = require('swig-email-templates')
    , nodemailer = require('nodemailer')
    , env = process.env.NODE_ENV || 'development'
    , config = require('../config/config')[env]
    ;

var cannotBlankErrMsg = 'can not be blank while sending email';

exports.sendEmail = function(user){
  if (!user) throw new Error('user ' + cannotBlankErrMsg);

  if(!user.email) throw new Error('email for user ' + cannotBlankErrMsg);

    var options = {
        root: path.join(__dirname, "../templates")

    };


    swigEmaileTemplate(options, function(err, render, generatedummy){
      render('authorizationEmail.html',
          {
              name:user.firstName,
              link:config.serverURL + '/users/activate/' + user.activateCode
          },

        function(err, resultHtml){
          var smtpTransport = nodemailer.createTransport("SMTP", config.SMTPTransportDetails);

          var mailOptions = {
              from: config.SMTPTransportDetails.auth.user,
              to: user.email,
              subject: "KinoEdu : Activate your KinoEdu account",
              generateTextFromHTML: true,
              html: resultHtml
          }

          smtpTransport.sendMail(mailOptions, function(error, response){
              if(error){
                  console.log(error);
                  throw error;
              }else{
                  console.log("mail sent: " + response.message);
              }
              smtpTransport.close();
          });
        }
      )
    })
}
