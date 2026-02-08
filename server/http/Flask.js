import express from 'express'
import http from 'http'
import cors from 'cors'

import { socketServer } from '../socket/SocketServer.js'

export class Flask {
	static routes = []
	static server = null

	static route(path, callback) {
		this.routes.push({ path, callback })
	}

	static listen(port) {
		const app = express()

		Flask.server = http.createServer(app)
		socketServer.start()

		app.use(express.json({
			type: ['application/json']
		}))

		app.use(express.raw({
			type: ['audio/*', 'application/octet-stream'],
		}))

		app.use(cors())

		app.post('/:path', (req, res) => {
			const path = req.params.path

			for (const r of this.routes) {
				if (r.path === path) {
					res.json(r.callback(req.body, req))
					return
				}
			}

			res.status(400).json({ error: 'Route not found' })
		})

		Flask.server.listen(port)
	}
}
