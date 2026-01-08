import express from 'express'
import cors from 'cors'

export class Flask {
	static routes = []

	static route(path, callback) {
		this.routes.push({ path, callback })
	}

	static listen(port) {
		const app = express()
		app.use(express.json())
		app.use(cors())

		app.post('/', (req, res) => {
			const { path, ...json } = req.body

			for (const r of this.routes) {
				if (r.path === path) {
					res.json(r.callback(json.body, req))
					return
				}
			}

			res.status(400).json({ error: 'Route not found' })
		})

		app.listen(port)
	}
}
