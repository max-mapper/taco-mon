var fs = require('fs')
var os = require('os')
var path = require('path')
var mkdirp = require('mkdirp')

module.exports = function link (opts, cb) {
  if (!opts) opts = {}
  var tacoDir = opts.path || process.cwd()
  var versionPath = path.resolve(opts.dir)
  var name = opts.name

  if (!name) {
    try {
      name = require(path.join(versionPath, 'package.json')).name
    } catch (err) {
      return cb(err)
    }
  }

  if (!name) return cb(new Error('Error: missing name in package.json'))

  var deployPath = path.resolve(path.join(tacoDir, 'deploys', name))

  mkdirp(path.join(tacoDir, 'deploys'), function (err) {
    if (err) return cb(err)
    fs.unlink(deployPath, function (err) {
      fs.symlink(versionPath, deployPath, cb)
    })
  })
}
