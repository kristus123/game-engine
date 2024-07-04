export class ObjectPersistence {
	constructor(filePath) {

	}

	get() {
		return Http.get(this.filePath)
			.map(object => ObjectMapper.mapFrom(object))
	}

	save(gameObject) {
		const objects = Http.get(this.filePath)

		objects.push(gameObject.mapToJson())

		Http.post(this.filePath, objects)
	}

	update(gameObject) {
		const objects = this.get()

		List.removeIf(objects, x => x.objectId == gameObject.objectId)

		objects.push(gameObject)

		Http.post(this.filePath, objects.map(c => c.mapToJson()))
	}

	remove(gameObject) {
		const objects = Http.get(this.filePath)

		List.removeIf(objects, x => JSON.parse(x).objectId == gameObject.objectId)

		Http.post(this.filePath, objects)
	}
}
