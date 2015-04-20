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
      if (err.code === 'ENOENT') console.error('Error: Could not find any taco process folders at this path')
      else console.error(err.message)
      process.exit(1)
    }
    procs.forEach(function (proc) {
      var status = ""
      if (proc.alive) status += 'running'
      else status += 'not running'
        
      if (proc.alive) status += ', started ' + relativeDate(proc.started)
      
      if (args.json) console.log(JSON.stringify(proc))
      else console.log(proc.name + ':', status)
    })
  })
}
