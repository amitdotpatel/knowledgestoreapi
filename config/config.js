/**
 * purpose - defining app level configurations
 * Created on 17 Oct 2013.
 */

module.exports = {
    development: {
      db: 'mongodb://localhost/kinoedu',
      port: process.env.PORT || 3000,
      serverURL : 'http://172.25.30.29:' //TODO - need to check how to get this dynamically
      //TODO - implement this in db
      , SMTPTransportDetails: {
          service: "Gmail",
          auth: {
              user: "kinoedusynerziptest",
              pass: "kinoedutest" ///use your account plz :)
          }
      },
      ResultCode_success : 0,
      ResultCode_failure :1,
      FACEBOOK_APP_ID: '1380075888904256',
      FACEBOOK_APP_SECRET: '1db52af478b80ba67fe285dec538dee6',
      GITHUB_CLIENT_ID: '188af985226c4715e0db',
      GITHUB_CLIENT_SECRET: '07ddb19045ee53af7ca02787067edc6e4e9c3722',
      GOOGLE_CLIENT_ID: '774542677130.apps.googleusercontent.com',
      GOOGLE_CLIENT_SECRET: 'PK3CYlbU47LrvQU-GwQuEVdu',
      courseState : {
        enrolled : 1,
        cancelled: 2,
        completed: 3
      }
    }
}
