const chokidar = require('chokidar')
const { execSync } = require('child_process');
const Process = require('./Process');
const KillPort = require('./KillPort');
const RandomId = require('./RandomId');

const express = require('express')



KillPort(8082)




let currentId = RandomId()

const app = express()
app.use(express.static('dist'))
app.get('/id', (req, res) => {
  res.json({ currentId: currentId })
})
app.listen(5000, () => console.log('Serving dist on port 5000'))

const watcher = chokidar.watch(['static'], {
  ignoreInitial: true,
  persistent: true,
  usePolling: false,
})


function runCommand(command) {
  try {
    const output = execSync(command, { stdio: 'pipe' }).toString();
    console.log(`stdout: ${output}`);
  } catch (error) {
    console.log(`error: ${error}`);
    if (error.stderr) console.log(`stderr: ${error.stderr.toString()}`);
  }
}

const socketServers = new Process('node socket_server/start_socket_servers.js')


runCommand('node build_tools/export_aseprite.js')
runCommand('node build_tools/generate_dist.js')
socketServers.start()


let idTimeout = null
watcher.on('all', (e, path) => {
  console.log("changed", path)

  if (path.includes(".aseprite")) {
    runCommand('node build_tools/export_aseprite.js ' + path)
  }

	socketServers.restart()
  runCommand('node build_tools/generate_dist.js')
	runCommand('node socket_server/start_socket_servers.js')

  if (idTimeout) clearTimeout(idTimeout)
  idTimeout = setTimeout(() => {
    currentId = RandomId()
    idTimeout = null
  }, 500)
})
