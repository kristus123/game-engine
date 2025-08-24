const chokidar = require('chokidar')
const { exec } = require('child_process')
const express = require('express')


const app = express()
app.use(express.static('dist'))
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

watcher.on('all', (event, path) => {
	runCommand('node build_tools/generate_dist.js')
	runCommand('node build_tools/export_aseprite.js')
})

