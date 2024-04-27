export class ObjectPersistence {
	constructor() {
	}

	static get() {
		return ObjectMapper.fromFile(Http.get('/world-editor')).objects.map(o => {
			return ObjectMapper.mapSingleObject(o)
		})
	}

	static save(o) {
		const saved = Http.get('/world-editor')

		saved.objects.push(ObjectMapper.toJson(o))

		Http.post('/world-editor', saved)
	}
}
