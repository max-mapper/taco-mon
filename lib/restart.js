var start = require('./start.js')
var stop = require('./stop.js')

module.exports = function restart (opts, cb) {
  stop(opts, function stopped (err, stdout, stderr) {
    if (err) {
      if (err.code && err.code === 'ENOENT') {} // ignore
      else if (err.code && err.code === 'ESRCH') {} // ignore
      else return cb(err)
    }
    start(opts, cb)
  })
}
