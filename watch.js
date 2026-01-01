const chokidar = require('chokidar')
const RandomId = require('./build_tools/RandomId')
const { Runner } = require('./build_tools/Runner')
const express = require('express')

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
