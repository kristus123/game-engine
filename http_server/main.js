const express = require('express')
const cors = require('cors')
const Files = require("./FileExplorer")
const fs = require('fs')
const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json()) // Automatically parses JSON bodies
app.use(cors())

app.post('/world-editor', (req, res) => {
	const jsonData = req.body
	fs.writeFile('data.json', JSON.stringify(jsonData), (err) => {
		if (err) {
			console.error('Error saving JSON data:', err)
			res.status(500).send('Error saving JSON data')
			return
		}
		console.log('JSON data saved successfully')
		res.status(200).send('JSON data saved successfully')
	})
})

app.get('/world-editor', (req, res) => {
	fs.readFile('data.json', 'utf8', (err, data) => {
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

app.get("/canvas-image", (req, res) => {
  try {
    const data = Files.inFolder("static/assets")
    if (data) {
      res.status(200).send(data)
    } else {
      res.status(404).send("no data")
    }
  } catch (error) {
    res.status(500).send("Error while fetching Images")
    return
  }
})

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`)
})
