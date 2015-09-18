var fs = require('fs')
var path = require('path')
var child = require('child_process')
var xtend = require('xtend')
var debug = require('debug')('taco-mon-start')

process.env.PATH = 'node_modules/.bin:' + process.env.PATH

module.exports = function start (opts, cb) {
  if (!opts) throw new Error('Error: Must specify options to start')
  var procPath = path.join(opts.path, 'deploys', opts.name)
  fs.exists(procPath, function (exists) {
    if (!exists) return cb(new Error('Error: Deployed process does not exist at this path'))
    fs.realpath(procPath, function (err, realPath) {
      if (err) return cb(err)
      var monCmd = createMonCommand(realPath, opts)
      if (!monCmd) return cb(new Error('Error: You must specify a start-production or start script in package.json'))
      debug('starting', monCmd)
      var execOpts = xtend({cwd: realPath}, opts.exec)
      child.exec(monCmd, execOpts, cb)
    })
  })
}

function createMonCommand (dir, opts) {
  var cmd = [opts.mon || __dirname + '/../node_modules/.bin/mon']
  cmd.push('-d')
  cmd.push('-l "' + (opts.logfile || path.join(dir, 'taco.log')) + '"')
  cmd.push('-p "' + (opts.pidfile || path.join(dir, 'taco.pid')) + '"')
  cmd.push('-m "' + (opts['mon-pidfile'] || path.join(dir, 'taco.mon.pid')) + '"')

  if (opts['on-error']) cmd.push('--on-error "' + opts['on-error'] + ' ' + opts.name + '"')
  if (opts['on-restart']) cmd.push('--on-restart "' + opts['on-restart'] + ' ' + opts.name + '"')
  if (opts.sleep) cmd.push('--sleep ' + opts.sleep)
  if (opts.attempts) cmd.push('--attempts ' + opts.attempts)
  if (opts.prefix) cmd.push('--prefix ' + opts.prefix)

  var startCmd = (opts.start || getStart(dir))
  if (!startCmd) return
  var startPrefix = opts['start-with'] || opts['start-prefix']
  if (startPrefix) startCmd = [startPrefix, startCmd].join(' ')
  cmd.push('"' + startCmd + '"')
  return cmd.join(' ')
}

function getStart (procPath) {
  var pkg = require(path.join(procPath, 'package.json'))
  var scripts = pkg.scripts
  if (!scripts) return
  if (scripts['start-production']) return scripts['start-production']
  if (scripts['start']) return scripts['start']
}
