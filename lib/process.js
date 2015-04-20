var fs = require('fs')
var path = require('path')

module.exports = {
  getPid: function (opts, cb) {
    var pidPath = opts.monpid || path.join(opts.path, 'deploys', opts.name, 'taco.mon.pid')
    fs.realpath(pidPath, function (err, realPid) {
      if (err) return cb(err)
      fs.readFile(realPid, 'ascii', function (err, pidString) {
        if (err) return cb(err)
        var pidInt = parseInt(pidString, 10)
        cb(null, {path: realPid, pid: pidInt})
      })
    })
  },
  alive: function alive (pid) {
    // from tj/node-mongroup
    try {
      if (typeof pid !== 'number') return false
      process.kill(pid, 0)
      return true
    } catch (err) {
      if ('ESRCH' != err.code) throw err
      return false
    }    
  }
}
