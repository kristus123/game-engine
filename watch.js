const chokidar = require('chokidar')
const RandomId = require('./RandomId')
const { Runner } = require('./Runner')
const express = require('express')

let currentId = RandomId()

const app = express()
app.use(express.static('dist'))
app.get('/currentId', (req, res) => { // this is used for hot-reloading. Check index.js
	res.json({ currentId: currentId })
})
app.listen(5000, () => console.log('Serving dist on port 5000'))

const watcher = chokidar.watch(['static'], {
	ignoreInitial: true,
	persistent: true,
	usePolling: false,
})


let idTimeout = null
watcher.on('all', (e, path) => {
	console.log('changed', path)

	if (idTimeout) {
		clearTimeout(idTimeout)
	}

	idTimeout = setTimeout(() => {
		if (path.includes('.aseprite')) {
			const task1 = new Runner('build_tools/export_aseprite.js' + path)
			task1.start()
		}
		const task2 = new Runner('build_tools/generate_dist.js')
		const task3 = new Runner('socket_server/start_socket_servers.js')
		task2.start()
		task3.start()

		currentId = RandomId()
		idTimeout = null
	}, 500)
})

const task4 = new Runner('build_tools/export_aseprite.js')
const task5 = new Runner('build_tools/generate_dist.js')
task4.start()
task5.start()
