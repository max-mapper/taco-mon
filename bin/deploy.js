var usage = require('../usage.js')('deploy.txt')
var deploy = require('../lib/deploy.js')

module.exports = {
  name: 'deploy',
  command: handleDeploy
}

function handleDeploy (args) {
  var dir = args._[0]
  if (!dir || args.h) return usage()
  args.path = dir
  var deployStream = deploy(args)
  process.stdin.pipe(deployStream).pipe(process.stdout)

  deployStream.on('error', function (err) {
    console.error(err.message)
    process.exit(1)
  })

  deployStream.on('finish', function () {
    console.error('Finished deploying')
  })
}
