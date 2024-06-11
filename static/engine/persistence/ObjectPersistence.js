export class ObjectPersistence {

	static get() {
		return Http.get('/world-editor')
			.map(string => ObjectMapper.mapFromString(string))
	}

	static save(gameObject) {
		const objects = Http.get('/world-editor')

		objects.push(ObjectMapper.mapToJsonString(gameObject))

		Http.post('/world-editor', objects)
	}

	static update(gameObject) {
		const objects = Http.get('/world-editor')

		List.removeIf(objects, x => JSON.parse(x).objectId == gameObject.objectId)

		objects.push(ObjectMapper.mapToJsonString(gameObject))

		Http.post('/world-editor', objects)
	}

	static remove(gameObject) {
		const objects = Http.get('/world-editor')

		List.removeIf(objects, x => JSON.parse(x).objectId == gameObject.objectId)

		Http.post('/world-editor', objects)
	}
}
