var usage = require('../usage.js')('start.txt')
var path = require('path')
var start = require('../lib/start.js')

module.exports = {
  name: 'start',
  command: handleStart
}

function handleStart (args) {
  var procName = args._[0]
  if (!procName) return usage()
  start({name: procName, path: args.path}, function started (err, stdout, stderr) {
    if (err) {
      console.error(err.message)
      process.exit(1)
    }
    console.error('Process started')
  })
}
