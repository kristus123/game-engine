export class Poop extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 10)

		this.position.width = 60
		this.position.height = 60

	}

	update() {
	}

	draw(draw, guiDraw) {
	}

	static mapFromJsonObject(json) {
		const c = new this(ObjectMapper.positionFromJson(json.position))
		c.objectId = json.objectId

		return c
	}

	mapToJsonString() {
		return ObjectMapper.mapToJsonString(this)
	}
}
