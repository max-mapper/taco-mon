var fs = require('fs')
var path = require('path')
var parallel = require('run-parallel')
var rimraf = require('rimraf')

module.exports = function (opts, cb) {
  var deploysDir = path.join(opts.path, 'deploys')
  var versionsDir = path.join(opts.path, 'versions')

  fs.readdir(deploysDir, function (err, files) {
    if (err && err.code === 'ENOENT') return cb()
    if (err) return cb(err)

    var fns = files.map(function (f) {
      return function (cb) {
        fs.realpath(path.join(deploysDir, f), cb)
      }
    })

    parallel(fns, function (err, deploys) {
      if (err) return cb(err)

      fs.readdir(versionsDir, function (err, versions) {
        if (err && err.code === 'ENOENT') return cb()
        if (err) return cb(err)

        versions = versions
          .map(function (dir) {
            return path.join(versionsDir, dir)
          })
          .filter(function (dir) {
            return deploys.indexOf(dir) === -1
          })
          .map(function (dir) {
            return function (cb) {
              rimraf(dir, cb)
            }
          })

        parallel(versions, cb)
      })
    })
  })
}
