export class StaticGameObject extends _GameObject {
	constructor(position) {
		super(position)
	}

	static mapFromJsonObject(json) {
		// hack. find out why you can't do new Chicke*n* because of transpiler

		const c = new this(ObjectMapper.positionFromJson(json.position))
		c.objectId = json.objectId

		return c
	}

	mapToJsonString() {
		return ObjectMapper.mapToJsonString(this)
	}

}
