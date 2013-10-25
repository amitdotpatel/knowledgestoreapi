/**
 * purpose - defining app level configurations
 * Created on 17 Oct 2013.
 */


var path = require('path')
    , rootPath = path.normalize(__dirname + '/..');

module.exports = {
    development: {
      db: 'mongodb://localhost/kinoedu',
      root: rootPath,
      serverURL : 'http://172.25.30.29:3000',
      SMTPTransportDetails: {
          service: "Gmail",
          auth: {
              user: "abhay.joshi@synerzip.com",
              pass: "XXX" ///use your account plz :)
          }
      }
    }
}
