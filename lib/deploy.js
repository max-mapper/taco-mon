var fs = require('fs')
var os = require('os')
var path = require('path')
var tar = require('tar-fs')
var cuid = require('cuid')
var mkdirp = require('mkdirp')
var duplex = require('duplexify')
var restart = require('./restart.js')

module.exports = function deploy (opts) {
  if (!opts) opts = {}
  var tacoDir = opts.path || process.cwd()
  var tmp = tmpdir()
  var stream = duplex()
  var extract = tar.extract(tmp)
  stream.setWritable(extract)
  stream.setReadable(false)
  stream.on('prefinish', function () {
    stream.cork()
    try {
      var pkg = require(path.join(tmp, 'package.json'))
      var procName = pkg.name
    } catch (e) {
      stream.destroy(e)
      return
    }
    
    var versionName = procName + '-' + Date.now()
    var versionPath = path.join(tacoDir, 'versions', versionName)
    var deployPath = path.join(tacoDir, 'deploys', procName)
    
    // ensure parent folders exist
    mkDirs(function (err) {
      if (err) return stream.destroy(err)
      // move our process app into those folders
      moveDir(function (err) {
        if (err) return stream.destroy(err)
        opts.name = procName
        // restart the mon process
        restart(opts, function (err) {
          if (err) return stream.destroy(err)
          stream.uncork()
        })
      })
    })
    
    function mkDirs (cb) {
      mkdirp(path.join(tacoDir, 'deploys'), function (err) {
        if (err) return cb(err)
        mkdirp(path.join(tacoDir, 'versions'), cb)
      })
    }
    
    function moveDir (cb) {
      fs.rename(tmp, versionPath, function (err) {
        if (err) return cb(err)
        fs.unlink(deployPath, function (err) {
          // ignore err
          fs.symlink(path.join('..', 'versions', versionName), deployPath, cb)
        })
      })
    }
  })
  
  return stream
}

function tmpdir () {
  return path.join(os.tmpdir(), 'taco-mon-' + cuid())
}
