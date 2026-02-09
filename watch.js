import chokidar from 'chokidar'
import express from 'express'

import RandomId from './build_tools/RandomId.js'
import { Runner } from './build_tools/Runner.js'
import Files from './build_tools/Files.js'

import { execSync } from 'child_process'

const killPort = (port) => {
	try {
		execSync(`fuser -k ${port}/tcp`)
		console.log(`Killed process on port ${port}`)
	}
	catch (e) {
		console.log(`Nothing running on port ${port}`)
	}
}


killPort(3000)
killPort(5000)
Files.deleteFolder('dist')

let currentId = RandomId()
let idTimeout = null

const app = express()
app.use(express.static('dist'))

app.get('/currentId', (req, res) => { // this is used for hot-reloading. Check index.js
	res.json({ currentId: currentId })
})

app.listen(5000, () => console.log('Serving dist on port 5000'))

const watcher = chokidar.watch(['game', 'engine'], {
	ignoreInitial: true,
	persistent: true,
	usePolling: true,
})

watcher.on('all', (e, path) => {
	console.log('changed', path)

	if (e == 'unlink' || e == 'unlinkDir') {
		console.log('rebuilding dist')
		Files.deleteFolder('dist')

		new Runner('build_tools/export_aseprite.js').start()
	}

	if (path.includes('.aseprite')) {
		new Runner('build_tools/export_aseprite.js', [path]).start()
	}

	new Runner('build_tools/generate_dist.js', ['DEVELOPMENT']).start()


	if (idTimeout) {
		clearTimeout(idTimeout)
	}

	idTimeout = setTimeout(() => {
		currentId = RandomId()
		idTimeout = null
	}, 500)
})


// initial build
new Runner('build_tools/export_aseprite.js').start()
new Runner('build_tools/generate_dist.js', ['DEVELOPMENT']).start()

// for now only run it once
new Runner('server/socket/SocketServer.js').start()
new Runner('server/http/main.js').start()
