import chokidar from 'chokidar'
import RandomId from './build_tools/RandomId.js'
import { Runner } from './build_tools/Runner.js'
import Files from './build_tools/Files.js'
import express from 'express'

Files.deleteFolder("dist")

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

	if (idTimeout) {
		clearTimeout(idTimeout)
	}

	idTimeout = setTimeout(() => {
		if (e == 'unlink' || e == 'unlinkDir') {
			console.log("rebuilding dist")
			Files.deleteFolder('dist')
		}

		if (path.includes('.aseprite')) {
			new Runner('build_tools/export_aseprite.js', [path]).start()
		}

		new Runner('build_tools/generate_dist.js').start()

		currentId = RandomId()
		idTimeout = null
	}, 500)
})

new Runner('build_tools/export_aseprite.js').start()
new Runner('build_tools/generate_dist.js').start()

// for now only run it once
new Runner('server/socket/SocketServer.js').start()
