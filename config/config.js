/**
 * purpose - defining app level configurations
 * Created on 17 Oct 2013.
 */


var path = require('path')
    , rootPath = path.normalize(__dirname + '/..');

module.exports = {
    development: {
      db: 'mongodb://localhost/kinoedu',
      root: rootPath
    }
}
