export class Chicken extends DynamicGameObject {
	constructor(position) { // todo find out what to do with this, or test if it even is a problem
		super(position, 10, 10)

		this.position.width = 60
		this.position.height = 60

		this.sprite = new Sprite(this, '/static/assets/sprites/chicken_sprite_32x32.png', 2, [
			{ x: 1, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 3, y: 3 },
			{ x: 3, y: 3 },
		])

		this.killed = false
		this.splatteredBody = []
		setTimeout(() => {
			this.killed = true

			const bodyPart = part => {
				const d = new DynamicGameObject(Random.direction(this.position, 10), 20, 20)
				const s = new Sprite(d, '/static/assets/sprites/dead_chicken_32x32.png', 2, [
					part
				])

				d.draw = (draw, guiDraw) => {
					s.draw(draw, guiDraw)
				}

				ForcePush(d).towards(Random.direction(d), 3)
				console.log(d.velocity.y)

				return d
			}

			this.splatteredBody = [
				bodyPart({ x: 1, y: 0 }),
				bodyPart({ x: 2, y: 0 }),
				bodyPart({ x: 2, y: 1 }),
				bodyPart({ x: 1, y: 1 }),
				bodyPart({ x: 1, y: 1 }),
				//bodyPart({ x: 3, y: 0 }),
				//bodyPart({ x: 1, y: 1 }),
				//bodyPart({ x: 2, y: 2 }),
			]


			this.onHit()
		}, 300)

	}

	onHit() {
		//this.removeFromGameLoop()
	}

	update() {
		const p = Random.direction(this, 0.1)

		this.x = p.x
		this.y = p.y
	}

	draw(draw, guiDraw) {
		if (!this.killed) {
			for (const b of this.splatteredBody) {
				b.draw(draw, guiDraw)
			}
		}
		else {
			draw.new_text(this.position.offset(0, -20), this.handledByClientId, 'red', 38)
			this.sprite.draw(draw, guiDraw)
		}
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
