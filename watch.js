import chokidar from 'chokidar'
import express from 'express'

import RandomId from './dev/build_tools/RandomId.js'
import { Runner } from './dev/build_tools/Runner.js'
import Files from './dev/build_tools/Files.js'

import { FileConfig } from './FileConfig.js'

Files.deleteFolder(FileConfig.dist)

let currentId = RandomId()
let idTimeout = null

const app = express()
app.use(express.static('dist'))

app.get('/currentId', (req, res) => { // this is used for hot-reloading. Check index.js
	res.json({ currentId: currentId })
})

app.listen(5000, () => console.log('Serving dist on port 5000'))

const watcher = chokidar.watch([FileConfig.game, FileConfig.engine], {
	ignoreInitial: true,
	persistent: true,
	usePolling: true,
})

watcher.on('all', (e, path) => {
	console.log('changed', path)

	if (e == 'unlink' || e == 'unlinkDir') {
		console.log('rebuilding dist')
		Files.deleteFolder('dist')

		new Runner(FileConfig.exportAseprite).start()
	}

	if (path.includes('.aseprite')) {
		new Runner(FileConfig.exportAseprite, [path]).start()
	}

	new Runner(FileConfig.generateDist, ['DEVELOPMENT']).start()


	if (idTimeout) {
		clearTimeout(idTimeout)
	}

	idTimeout = setTimeout(() => {
		currentId = RandomId()
		idTimeout = null
	}, 500)
})


// initial build
new Runner(FileConfig.exportAseprite).start()
new Runner(FileConfig.generateDist, ['DEVELOPMENT']).start()

// for now only run it once
new Runner('server/socket/SocketServer.js').start()
new Runner('server/http/main.js').start()
