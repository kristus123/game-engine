import { FileDb } from './FileDb.js'
import { Flask } from './Flask.js'

Flask.route('uploadFile', (body, req) => {

	const type = req.headers['content-type'] || ''

	const key = crypto.randomUUID()

	if (type.includes('application/json')) {
		FileDb.saveFile(key, body)
		return { status: 'server success', data: key }
	}
	
	if (type.startsWith('audio/') || type === 'application/octet-stream') {
		const ext = type.split('/')[1] || 'bin'
		const filename = `${key}.${ext}`

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
