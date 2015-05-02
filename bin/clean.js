var usage = require('../usage.js')('clean.txt')
var clean = require('../lib/clean.js')

module.exports = {
  name: 'clean',
  command: handleClean
}

function handleClean (args) {
  if (args.h) return usage()
  clean(args, function (err) {
    if (err) console.error(err.message)
  })
}
