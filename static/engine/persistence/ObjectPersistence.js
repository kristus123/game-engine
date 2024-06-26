export class ObjectPersistence {
	constructor(filePath) {
		
	}

	get() {
		return Http.get(this.filePath)
			.map(string => ObjectMapper.mapFromString(string))
	}

	save(gameObject) {
		const objects = Http.get(this.filePath)

		objects.push(ObjectMapper.mapToJsonString(gameObject))

		Http.post(this.filePath, objects)
	}

	update(gameObject) {
		const objects = Http.get(this.filePath)

		List.removeIf(objects, x => JSON.parse(x).objectId == gameObject.objectId)

		objects.push(ObjectMapper.mapToJsonString(gameObject))

		Http.post(this.filePath, objects)
	}

	remove(gameObject) {
		const objects = Http.get(this.filePath)

		List.removeIf(objects, x => JSON.parse(x).objectId == gameObject.objectId)

		Http.post(this.filePath, objects)
	}
}
