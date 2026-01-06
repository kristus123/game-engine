import express from 'express'
import cors from 'cors'

import Path from 'path'
import { FileDb } from './FileDb.js'

const app = express()
app.use(express.json()) // Automatically parses JSON bodies
app.use(cors())

app.post('/api/:method', (req, res) => {
	const method = req.params.method

	if (method === 'write') {
		FileDb.save('test', req.body)

		res.send({
			test: method,
			body: req.body,
		})

	}
	else if (method === 'read') {
		const data = FileDb.get(req.body.filename)

		res.send({
			test: method,
			body: data,
		})

	}

})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`)
})
