import express from 'express'
import cors from 'cors'

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
		app.use(cors())

		console.log(this.routes)

		for (const r of this.routes) {
			console.log(r)
			app.post(r.path, async (req, res) => {
				const out = await r.callback(req.body, req)
				console.log(req)
				res.json(out)
			})
		}
		
		app.listen(port)
	}
}
