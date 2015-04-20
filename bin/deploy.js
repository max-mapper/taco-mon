var usage = require('../usage.js')('deploy.txt')
var deploy = require('../lib/deploy.js')

module.exports = {
  name: 'deploy',
  command: handleDeploy
}

function handleDeploy (args) {
  var dir = args._[0]
  if (args.h) return usage()
  var deployStream = deploy({path: dir})
  process.stdin.pipe(deployStream).pipe(process.stdout)

  deployStream.on('error', function (err) {
    console.error(err.message)
    process.exit(1)
  })

  deployStream.on('finish', function () {
    console.error('Finished deploying')
  })
}
