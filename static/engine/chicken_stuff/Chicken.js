export class Chicken extends DynamicGameObject {
	constructor(position, run=() => {}) {
		super(position, 10, 10)

		this.position.width = 60
		this.position.height = 60

		this.sprite = new Sprite(this, '/static/assets/sprites/chicken_sprite_32x32.png', [
			{ x: 1, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 3, y: 3 },
			{ x: 3, y: 3 },
		])

		this.feathers = new LocalObjects()

	}

	onHit() {
		this.killed = new Killed(this)
		//this.removeFromGameLoop()
		SineWave.play()
	}

	update() {
		const p = Random.direction(this, 0.1)

		this.x = p.x
		this.y = p.y

		this.run(this)
	}

	draw(draw, guiDraw) {
		if (Math.abs(this.velocity.x) || Math.abs(this.velocity.y)) {
			if (Random.chance()) {
				const f = new Feather(this.position)
				Push(f).towards(Random.direction(this.position), 10)
				this.feathers.add(f)
			}
		}

		this.feathers.draw(draw, guiDraw)

		if (this.killed) {
			this.killed.draw(draw, guiDraw)
		}
		else {
			// draw.text(this.position.offset(0, -20), this.objectId, 'red', 38)
			this.sprite.draw(draw, guiDraw)
			//super.draw(draw, guiDraw)
		}

	}

	static mapFromJsonObject(json) {
		const o = new this(new Position(json.position.x, json.position.y, json.position.width, json.position.height))
		o.objectId = json.objectId

		return o
	}

	mapToJson() {
		return {
			className: this.constructor.name,
			objectId: this.objectId,
			position: {
				x: this.x,
				y: this.y,
				width: this.width,
				height: this.height,
			},
		}
	}
}
