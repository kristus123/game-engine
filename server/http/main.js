import { FileDb } from './FileDb.js'
import { Flask } from './Flask.js'

Flask.route('uploadFile', (body, req) => {

	const type = req.headers['content-type'] || ''

	if (type.includes('application/json')) {
		FileDb.saveFile('test', body) // TODO: Make Filename Random In Production.
		return { status: 'server success' }
	}
	
	if (type.startsWith('audio/') || type === 'application/octet-stream') {
		const ext = type.split('/')[1] || 'bin'
		const filename = `audio_${Date.now()}.${ext}`

		FileDb.saveFile(filename, body)

		return {
			status: 'server success (audio)',
			filename
		}
	}

	return { status: 'server failure' }
})

Flask.route('readFile', (body) => {
	return FileDb.getFile(body.filename)
})

Flask.route('deleteFile', (body) => {
	return FileDb.deleteFile(body.filename)
})

const PORT = 3000
Flask.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`)
})
