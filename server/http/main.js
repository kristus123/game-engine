import express from 'express'
import cors from 'cors'

import Path from 'path'
import { FileDb } from './FileDb.js'

const app = express()
app.use(express.json()) // Automatically parses JSON bodies
app.use(cors())

app.post('/uploadFile', (req, res) => {
	const type = req.headers['content-type'] || ''

	if (type.includes('application/json')) {
		FileDb.save('test', req.body)
		res.sendStatus(200)
		return
	}

	if (type.startsWith('audio/')) {
		const file = fs.createWriteStream('audio.webm')
		req.pipe(file)
		req.on('end', () => res.sendStatus(200))
		return
	}
})

app.post('/readFile', (req, res) => {
	const data = FileDb.get(req.body.filename)

	res.send({
		body: data,
	})
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`)
})
