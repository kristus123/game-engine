import express from 'express'
import cors from 'cors'

import { FileDb } from './FileDb.js'

const app = express()
app.use(express.json()) // Automatically parses JSON bodies
app.use(cors())

app.post('/*', (req, res) => {
	const xxx = req.params[0]

	FileDb.save('test', req.body)

	res.send({
		test: xxx,
		body: req.body,
	})
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`)
})
