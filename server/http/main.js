import Path from 'path'
import { FileDb } from './FileDb.js'
import { Fetch } from './Fetch.js'

const app = new Fetch()

app.route('/uploadFile', (req, res) => {
	const type = req.headers['Content-Type'] || ''

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

app.route('/readFile', (req, res) => {
	const data = FileDb.get(req.body.filename)

	res.send({
		body: data,
	})
})

const PORT = 3000
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`)
})
