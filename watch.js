const chokidar = require('chokidar')
const { execSync } = require('child_process');
const Process = require('./Process');
const KillPort = require('./KillPort');

const express = require('express')


function randomId(length = 32) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = ''
  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}



KillPort(8082)




let currentId = randomId()

const app = express()
app.use(express.static('dist'))

app.get('/id', (req, res) => {
  res.json({ id: currentId })
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
    currentId = randomId()
    idTimeout = null
  }, 500)
})


runCommand('node build_tools/export_aseprite.js')
runCommand('node build_tools/generate_dist.js')
socketServers.start()
