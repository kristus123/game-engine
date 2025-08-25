const chokidar = require('chokidar')
const { exec } = require('child_process')
const express = require('express')

function randomId(length = 32) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = ''
  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

let currentId = randomId()
let idTimeout = null

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
  exec(command, (error, stdout, stderr) => {
    console.log(`error: ${error}`)
    console.log(`stderr: ${stderr}`)
    console.log(`stdout: ${stdout}`)
  })
}

watcher.on('all', (e, path) => {
  console.log("changed", path)

  if (path.includes(".aseprite")) {
    runCommand('node build_tools/export_aseprite.js ' + path)
  }

  runCommand('node build_tools/generate_dist.js')

  if (idTimeout) clearTimeout(idTimeout)
  idTimeout = setTimeout(() => {
    currentId = randomId()
    idTimeout = null
  }, 500)
})

runCommand('node build_tools/export_aseprite.js')
runCommand('node build_tools/generate_dist.js')
