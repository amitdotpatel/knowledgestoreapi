/**
 * Created by abhay on 23/10/13.
 */

/*
* some changes need to do run this
*
* TODO - 1. define constants in config and use those. e.g. link address, user, etc
*
* */

var path = require('path')
    , swigEmaileTemplate = require('swig-email-templates')
    , nodemailer = require('nodemailer')
    ;

exports.sendEmail = function(user){
  if (!user) throw new Error('user can not be blank while sending email');

  if(!user.email) throw new Error('user email can not be blank');

    var options = {
        root: path.join(__dirname, "../templates")

    };

    swigEmaileTemplate(options, function(err, render, generatedummy){
      render('authorizationEmail.html',
          {
              name:user.name,
              link:"http://172.25.30.29:3000/users/activate/" + user.authenticateCode
          },

        function(err, resultHtml){
          console.log(resultHtml);
          var smtpTransport = nodemailer.createTransport("SMTP",{
              service: "Gmail",
              auth: {
                  user: "abhay.joshi@synerzip.com",
                  pass: "XXXXXXXXXX" ///use your account plz :)
              }
          });
          // setup e-mail data with unicode symbols
          var mailOptions = {
              from: "abhay.joshi@synerzip.com", // sender address
              to: user.email, // list of receivers
              subject: "Activate your KinoEdu account", // Subject line
              generateTextFromHTML: true,
              html: resultHtml // html body
          }
          smtpTransport.sendMail(mailOptions, function(error, response){
              if(error){
                  console.log(error);
              }else{
                  console.log("Message sent: " + response.message);
              }

              smtpTransport.close(); // shut down the connection pool, no more messages
          });
        }
      )
    })
}
