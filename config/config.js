/**
 * purpose - defining app level configurations
 * Created on 17 Oct 2013.
 */

module.exports = {
    development: {
      db: 'mongodb://localhost/kinoedu',
      port: 3000,
      serverURL : 'http://172.25.30.29:' + this.port //TODO - need to check how to get this dynamically
      //TODO - implement this in db
      , SMTPTransportDetails: {
          service: "Gmail",
          auth: {
              user: "abhay.joshi@synerzip.com",
              pass: "nodejsrocks" ///use your account plz :)
          }
      }
    }
}
