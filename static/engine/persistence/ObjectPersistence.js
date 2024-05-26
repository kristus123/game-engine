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

		saved.objects.push(ObjectMapper.mapToJson(o))
		Http.post('/world-editor', saved)
	}

	static update(o) {
		const saved = Http.get('/world-editor')

		List.removeIf(saved.objects, x => {
			x = JSON.parse(x)
			return x.objectId == o.objectId
		})

		saved.objects.push(ObjectMapper.mapToJson(o))
		Http.post('/world-editor', saved)
	}
}
