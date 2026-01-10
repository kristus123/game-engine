import { FileDb } from './FileDb.js'
import { Flask } from './Flask.js'

Flask.route('uploadFile', (body, req) => {
	const type = req.headers['content-type'] || ''

	if (type.includes('application/json')) {
		FileDb.save('test', body)
		return { status: 'server success' }
	}

	return { status: 'server failure' }
})

Flask.route('readFile', (body, req) => {
	return FileDb.get(body.filename)
})

const PORT = 3000
Flask.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`)
})
