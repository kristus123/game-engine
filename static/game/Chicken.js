class BodyPart extends DynamicGameObject {
	constructor(position, imagePath, part) {
		super(position, 20, 20)
		this.width = 64
		this.height = 64

		this.s = new SpinningSpriteFrame(this, imagePath, part)

		ForcePush(this).towards(Random.direction(position), Random.integerBetween(6, 12))
	}

	draw(draw, guiDraw) {
		this.s.draw(draw, guiDraw)
	}

}

class Killed {
	constructor(c) {
		const chickenSprite = '/static/assets/sprites/dead_chicken_32x32.png'

		this.splatteredBody = [
			new BodyPart(Random.direction(c, 10), chickenSprite, { x: 1, y: 0 }),
			new BodyPart(Random.direction(c, 10), chickenSprite, { x: 2, y: 0 }),
			new BodyPart(Random.direction(c, 10), chickenSprite, { x: 2, y: 1 }),
			new BodyPart(Random.direction(c, 10), chickenSprite, { x: 1, y: 1 }),
			new BodyPart(Random.direction(c, 10), chickenSprite, { x: 1, y: 1 }),
		]
	}

	draw(draw, guiDraw) {
		for (const b of this.splatteredBody) {
			b.draw(draw, guiDraw)
		}
	}
}

class Feather extends DynamicGameObject {

	constructor(position) {
		super(position, 10, 10)
		this.position = this.position.copy()


		const choice = Random.choice([
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
		])
		this.image = new SpriteFrame(this, '/static/assets/sprites/chicken_feathers_16x16.png', choice)
		this.position.width = 16
		this.position.height = 16

	}

	draw(draw, guiDraw) {
		this.image.draw(draw, guiDraw)
	}
}

export class Chicken extends DynamicGameObject {
	constructor(position) {
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
		console.log('hit hicjen')
		this.killed = new Killed(this)
		//this.removeFromGameLoop()
		SineWave.play()
	}

	update() {
		const p = Random.direction(this, 0.1)

		this.x = p.x
		this.y = p.y
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
			draw.text(this.position.offset(0, -20), this.handledByClientId, 'red', 38)
			this.sprite.draw(draw, guiDraw)
			//super.draw(draw, guiDraw)
		}

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
