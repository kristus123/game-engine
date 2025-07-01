import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 
import { Http } from '/static/engine/http/Http.js'; 
import { AllObjects } from '/static/engine/objects/AllObjects.js'; 

export class PersistedObjects extends AllObjects {
	constructor(filePath, mapFromJson) {
		super([])

				AssertNotNull(filePath, "argument filePath in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(mapFromJson, "argument mapFromJson in " + this.constructor.name + ".js should not be null")
			
		this.filePath = filePath; 
		this.mapFromJson = mapFromJson; 


		Http.get(this.filePath)
			.map(json => mapFromJson(json))
			.forEach(o => super.add(o))
	}

	add(o) {
		AssertNotNull(o.objectId, 'objectId should not be null. It is needed to persist')

		const objects = Http.get(this.filePath)

		objects.push(o.mapToJson())

		Http.post(this.filePath, objects)

		super.add(o)
	}

	persist(o) {
		const objects = Http.get(this.filePath)
			.map(json => this.mapFromJson(json))

		List.removeIf(objects, x => x.objectId == o.objectId)
		objects.push(o)

		Http.post(this.filePath, objects.map(c => c.mapToJson()))
	}

	remove(o) {
		const objects = Http.get(this.filePath)
		List.removeIf(objects, x => x.objectId == o.objectId)
		Http.post(this.filePath, objects)

		super.remove(o)
	}
}
