var usage = require('../usage.js')('stop.txt')
var path = require('path')
var stop = require('../lib/stop.js')

module.exports = {
  name: 'stop',
  command: handleStop
}

function handleStop (args) {
  var procName = args._[0]
  if (!procName || args.h) return usage()
  stop({name: procName, path: args.path}, function stopped (err, stdout, stderr) {
    if (err) {
      if (err.code && err.code === 'ENOENT') console.error('Process was already killed')
      else if (err.code && err.code === 'ESRCH') console.error('Process was not running')
      else console.error(err.message)
      process.exit(1)
    }
    console.error('Process stopped')
  })
}
