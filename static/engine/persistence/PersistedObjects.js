export class PersistedObjects extends AllObjects {
	constructor(filePath, mapFromJson) {
		super([])

		Http.get(this.filePath)
			.map(json => mapFromJson(json))
			.forEach(o => super.add(o))
	}

	add(o) {
		const objects = Http.get(this.filePath)

		objects.push(o.mapToJson())

		Http.post(this.filePath, objects)

		super.add(o)
	}

	persist(o) {
		const objects =  Http.get(this.filePath)
			.map(json => this.mapFromJson(json))

		List.removeIf(objects, x => x.objectId == o.objectId)
		objects.push(o)
		Http.post(this.filePath, objects.map(c => c.mapToJson()))
	}

	remove(o) {
		const objects = Http.get(this.filePath)
		List.removeIf(objects, x => JSON.parse(x).objectId == o.objectId)
		Http.post(this.filePath, objects)

		super.remove(o)
	}
}
