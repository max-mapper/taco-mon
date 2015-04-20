#!/usr/bin/env node

var subcommand = require('subcommand')

var config = {
  root: require('./bin/root.js'),
  commands: [
    require('./bin/deploy.js'),
    require('./bin/status.js'),
    require('./bin/start.js'),
    require('./bin/stop.js'),
    require('./bin/restart.js'),
    require('./bin/link.js')
  ],
  defaults: require('./bin/defaults.js'),
  none: noMatch
}

var route = subcommand(config)
route(process.argv.slice(2))

function noMatch (args) {
  console.error('taco-mon:', args._[0], 'is not a valid command')
  process.exit(1)
}
