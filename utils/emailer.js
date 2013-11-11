/**
 * Created by abhay on 23/10/13.
 */


var path = require('path')
    , swigEmaileTemplate = require('swig-email-templates')
    , nodemailer = require('nodemailer')
    , config = require('../config/config')[process.env.NODE_ENV]
    ;

var cannotBlankErrMsg = 'can not be blank while sending email';

var validateUserForEmail = function(user){
    if (!user) throw new Error('user ' + cannotBlankErrMsg);

    if(!user.email) throw new Error('email for user ' + cannotBlankErrMsg);
}

var initRoot = function(){
    return {
        root: path.join(__dirname, "../templates")
    };
}

exports.sendEmail = function(user){
    validateUserForEmail(user);
    var options = initRoot();


    swigEmaileTemplate(options, function(err, render, generatedummy){
      render('authorizationEmail.html',
          {
              name:user.firstName,
              link:config.serverURL + config.port + '/users/activate/' + user.activateCode
          },
        function(err, resultHtml){
          if(err){
            throw err;
          }
          console.log(resultHtml);
            sendMailSMTP(user.email, resultHtml, "KinoEdu : Activate your KinoEdu account");
        }
      )
    })
}

var sendMailSMTP = function(userEmail, resultHtml, subject){
    var smtpTransport = nodemailer.createTransport("SMTP", config.SMTPTransportDetails);

    var mailOptions = {
        from: config.SMTPTransportDetails.auth.user,
        to: userEmail,
        subject: subject,
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


exports.sendChangePassMail = function(user){
    validateUserForEmail(user);
    var options = initRoot();

    swigEmaileTemplate(options, function(err, render, generatedummy){
        render('resetPass.html',
            {
                name:user.firstName,
                newPass:user.password
            },
            function(err, resultHtml){
                if(err){
                  throw err;
                }
                console.log(resultHtml);
                sendMailSMTP(user.email, resultHtml, "KinoEdu account : reset password");
            }
        )
    })
}
