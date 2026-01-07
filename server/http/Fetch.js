import express from 'express'

export class Fetch {
	constructor() {
		this.routes = []
	}

	route(path, callback) {
		this.routes.push({ path, callback })
	}

	listen(port) {
		const app = express()
		app.use(express.json())

		console.log(this.routes)

		for (const r of this.routes) {
			console.log(r)
			app.post(r.path, async (req, res) => {
				const out = await r.fn(req.body, req)
				res.json(out)
			})

			app.listen(port)
		}
	}
}
