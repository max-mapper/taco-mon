var fs = require('fs')
var path = require('path')
var parallel = require('run-parallel')
var monProcess = require('./process.js')

module.exports = function (opts, cb) {
  var deploysDir = path.join(opts.path, 'deploys')
  fs.readdir(deploysDir, function (err, files) {
    if (err) return cb(err)
    var readErr
    var fns = []
    var results = []
    files.forEach(function (f) {
      fns.push(getInfo)
      
      function getInfo (cb) {
        fs.stat(path.join(deploysDir, f), function (err, stat) {
          if (err) return cb(err)
          if (!stat.isDirectory()) return cb(null)
          monProcess.getPid({path: opts.path, name: f}, function (err, pid) {
            if (err && err.code === 'ENOENT') {
              results.push({
                started: null,
                alive: false,
                pid: null,
                name: f
              })
              return cb()
            } else if (err) {
              return cb(err)
            }
            fs.stat(pid.path, function (err, pidStat) {
              if (err) return cb(err)
              var alive = monProcess.alive(pid.pid)
              var started = alive ? pidStat.mtime : null
              results.push({
                started: started || null,
                alive: alive,
                pid: pid.pid,
                name: f
              })
              cb()
            })
          })
        })
      }
    })
    
    parallel(fns, function (err) {
      cb(err, results)
    })
  })
}
