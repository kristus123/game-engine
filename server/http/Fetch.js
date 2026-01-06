import express from 'express'

export class Fetch {
	constructor() {
		this.routes = []
	}

	route(route, callback) {
		this.routes.push({ route, callback })
	}

	listen(port) {
		const app = express()
		app.use(express.json())

		for (const r of this.routes) {
			app.post(r.path, async (req, res) => {
				const out = await r.fn(req.body, req)
				res.json(out)
			})

			app.listen(port)
		}
	}
}
