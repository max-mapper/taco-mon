var usage = require('../usage.js')('link.txt')
var path = require('path')
var link = require('../lib/link.js')

module.exports = {
  name: 'link',
  command: handleStart
}

function handleStart (args) {
  var dir = args._[0]
  if (!dir || args.h) return usage()
  link({dir: dir, path: args.path, name: args.name}, function started (err, stdout, stderr) {
    if (err) {
      console.error(err.message)
      process.exit(1)
    }
    console.error('Process linked')
  })
}
