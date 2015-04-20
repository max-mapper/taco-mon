var fs = require('fs')
var path = require('path')
var monProcess = require('./process.js')

module.exports = function stop (opts, cb) {
  monProcess.getPid(opts, function (err, pid) {
    if (err) return cb(err)
    try {
      process.kill(pid.pid, opts.sig || 'SIGTERM')
    } catch (e) {
      return cb(e)
    }
    if (opts.wait === false) removePid()
    else pollExit(pid.pid, removePid)
      
    function removePid () {
      fs.unlink(pid.path, cb)
    }
  })  
  
  function pollExit (pid, fn) {
    setTimeout(function () {
      if (monProcess.alive(pid)) return pollExit(pid, fn)
      fn()
    }, 250)
  }
}
