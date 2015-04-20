var usage = require('../usage.js')('status.txt')
var path = require('path')
var relativeDate = require('relative-date')
var status = require('../lib/status.js')

module.exports = {
  name: 'status',
  command: handleStatus
}

function handleStatus (args) {
  if (args.h) return usage()
  status(args, function (err, procs) {
    if (err) {
      console.error(err.message)
      process.exit(1)
    }
    procs.forEach(function (proc) {
      console.log(proc)
    })
  })
}
