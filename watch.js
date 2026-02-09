import chokidar from 'chokidar'
import express from 'express'

import RandomId from './dev/build_tools/RandomId.js'
import { Runner } from './dev/build_tools/Runner.js'
import Files from './dev/build_tools/Files.js'

import paths from './config.js'

Files.deleteFolder('dist')

let currentId = RandomId()
let idTimeout = null

const app = express()
app.use(express.static('dist'))

app.get('/currentId', (req, res) => { // this is used for hot-reloading. Check index.js
	res.json({ currentId: currentId })
})

app.listen(5000, () => console.log('Serving dist on port 5000'))

const watcher = chokidar.watch([paths.game, paths.engine], {
	ignoreInitial: true,
	persistent: true,
	usePolling: true,
})

watcher.on('all', (e, path) => {
	console.log('changed', path)

	if (e == 'unlink' || e == 'unlinkDir') {
		console.log('rebuilding dist')
		Files.deleteFolder('dist')

		new Runner('dev/build_tools/export_aseprite.js').start()
	}

	if (path.includes('.aseprite')) {
		new Runner('dev/build_tools/export_aseprite.js', [path]).start()
	}

	new Runner('dev/build_tools/generate_dist.js', ['DEVELOPMENT']).start()


	if (idTimeout) {
		clearTimeout(idTimeout)
	}

	idTimeout = setTimeout(() => {
		currentId = RandomId()
		idTimeout = null
	}, 500)
})


// initial build
new Runner('dev/build_tools/export_aseprite.js').start()
new Runner('dev/build_tools/generate_dist.js', ['DEVELOPMENT']).start()

// for now only run it once
new Runner('server/socket/SocketServer.js').start()
new Runner('server/http/main.js').start()
