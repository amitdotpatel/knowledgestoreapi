/**
 * purpose - defining app level configurations
 * Created on 17 Oct 2013.
 */

module.exports = {
    development: {
      db: 'mongodb://localhost/kinoedu',
      port: 3000,
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
      ResultCode_failure :1
    }
}
