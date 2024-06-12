class BodyPart extends DynamicGameObject {
	constructor(position, imagePath, part) {
		super(position, 20, 20)
		this.width = 64
		this.height = 64

		this.s = new SpriteFrame(this,imagePath, part)

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

		//setTimeout(() => {
		//	this.onHit()
		//	console.log("chicken killed")
		//}, 300)

	}

	onHit() {
		console.log("hit hicjen")
		this.killed = new Killed(this)
		//this.removeFromGameLoop()
	}

	update() {
		const p = Random.direction(this, 0.1)

		this.x = p.x
		this.y = p.y
	}

	draw(draw, guiDraw) {
		if (this.killed) {
			this.killed.draw(draw, guiDraw)
		}
		else {
			draw.new_text(this.position.offset(0, -20), this.handledByClientId, 'red', 38)
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
