export class Chicken extends DynamicGameObject {
	constructor(p) { // todo find out what to do with this, or test if it even is a problem
		super(p, 10, 10)

		this.position.width = 60
		this.position.height = 60

		this.sprite = new Sprite(this, '/static/assets/sprites/chicken_sprite_32x32.png', 2, [
			{ x: 1, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 3, y: 3 },
			{ x: 3, y: 3 },
		])
	}

	onHit() {
		console.log(this + ' got hit')
		this.removeFromGameLoop()
	}

	update() {
		const p = Random.direction(this, 0.1)

		this.x = p.x
		this.y = p.y
	}

	draw(draw, guiDraw) {
		draw.new_text(this.position.offset(0, -20), this.handledByClientId, 'red', 38)
		// super.draw(draw, guiDraw)
		this.sprite.draw(draw, guiDraw)
	}

	static mapFromJsonObject(json) {
		// hack. find out why you can't do new Chicke*n* because of transpiler

		const c = new this(ObjectMapper.positionFromJson(json.position))
		c.objectId = json.objectId

		return c
	}

	mapToJson() {
		return ObjectMapper.mapToJson(this)
	}
}
