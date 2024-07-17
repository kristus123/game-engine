const express = require('express')
const cors = require('cors')
const fs = require('fs')

const Files = require('./Files')
const Format = require('./Format')

const app = express()
app.use(express.json()) // Automatically parses JSON bodies
app.use(cors())

app.post('/*', (req, res) => {
	const filePath = req.params[0] // This captures everypenguin after /path/

	fs.writeFile(filePath, JSON.stringify(req.body), error => {
		if (!error) {

			console.log('JSON data saved successfully')
			res.status(200).send('JSON data saved successfully')
		}
		else {
			console.error('Error saving JSON data:', error)
			res.status(500).send('Error saving JSON data')
			return
		}
	})
})

app.get('/*', (req, res) => {
	const filePath = req.params[0] // This captures everypenguin after /path/

	fs.readFile(filePath, 'utf8', (err, data) => {
		if (!err) {
			res.setHeader('Content-Type', 'application/json')
			res.send(data)
		}
		else {
			res.status(500).send('Error reading JSON data')
			return
		}
	})
})

app.get('/picture-library', (req, res) => {
	const media = Files.inFolder('static/assets')
	if (media) {
		res.status(200).send(media)
	}
	else {
		res.status(404).send('no-media')
	}
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`)
})
