import { FileDb } from './FileDb.js'
import { Flask } from './Flask.js'

Flask.route('uploadFile', (body, req) => {

	const type = req.headers['content-type'] || ''
	
	const senderId = req.headers['x-client-id']
	const filename = crypto.randomUUID()

	if (type.includes('application/json')) {
		FileDb.saveFile(`${senderId}/${filename}`, body)
		return { status: 'server success' }
	}
	
	if (type.startsWith('audio/') || type === 'application/octet-stream') {
		const ext = type.split('/')[1] || 'bin'
		const path = `${senderId}/${filename}.${ext}`

		FileDb.saveFile(path, body)

		return {
			status: 'server success (audio)',
			path
		}
	}

	return { status: 'server failure' }
})

Flask.route('readFile', (body) => {
	return FileDb.getFile(body.filename)
})

Flask.route('readFiles', (body) => {
	return FileDb.getFilesInFolder(body.folder)
})

Flask.route('deleteFile', (body) => {
	return FileDb.deleteFile(body.filename)
})

const PORT = 3000
Flask.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`)
})
