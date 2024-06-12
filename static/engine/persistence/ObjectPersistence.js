export class ObjectPersistence {

	static get() {
		return Http.get('/world-editor')
			.map(string => ObjectMapper.mapSingleObject(string))
	}

	static save(gameObject) {
		const objects = Http.get('/world-editor')

		objects.push(ObjectMapper.mapToJson(gameObject))

		Http.post('/world-editor', objects)
	}

	static update(o) {
		const objects = Http.get('/world-editor')

		List.removeIf(objects, x => JSON.parse(x).objectId == o.objectId)

		objects.push(ObjectMapper.mapToJson(o))

		Http.post('/world-editor', objects)
	}
}
