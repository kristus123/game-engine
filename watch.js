const chokidar = require('chokidar')
const RandomId = require('./RandomId')
const RunCommand = require('./RunCommand')
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
		//	RunCommand('node build_tools/export_aseprite.js ' + path)
		}

		RunCommand('node build_tools/generate_dist.js')

		currentId = RandomId()
		idTimeout = null
	}, 500)
})

//RunCommand('node build_tools/export_aseprite.js')
RunCommand('node build_tools/generate_dist.js')
