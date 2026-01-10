import { FileDb } from './FileDb.js'
import { Flask } from './Flask.js'

Flask.route('uploadFile', (body, req) => {

	const type = req.headers['content-type'] || ''

	if (type.includes('application/json')) {
		FileDb.saveFile('test', body)
		return { status: 'server success' }
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
