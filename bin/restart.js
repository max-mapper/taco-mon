var usage = require('../usage.js')('restart.txt')
var path = require('path')
var restart = require('../lib/restart.js')

module.exports = {
  name: 'restart',
  command: handleRestart
}

function handleRestart (args) {
  var procName = args._[0]
  if (!procName) return usage()
  restart({name: procName, path: args.path}, function (err, stdout, stderr) {
    if (err) {
      console.error(err.message)
      process.exit(1)
    }
    console.error('Process restarted')
  })
}
