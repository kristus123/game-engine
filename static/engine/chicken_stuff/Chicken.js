export class Chicken extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 1000)

		this.position.width = 60
		this.position.height = 60

		this.sprite = new Sprite(this, '/static/assets/sprites/chicken_sprite_32x32.png', [
			{ x: 1, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 3, y: 3 },
			{ x: 3, y: 3 },
		])

		this.eatingSprite = new Sprite(this, '/static/assets/sprites/chicken_eating_38x32.png', [
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
			{ x: 4, y: 0 },
			{ x: 5, y: 0 },
			{ x: 6, y: 0 },
			{ x: 7, y: 0 },
			{ x: 8, y: 0 },
		])

		if (!this.touchesAny(G.zones.regions)) {
			this.zone = Random.choice(G.zones.regions)
		}

		this.positionInsideZone = new Position(0,0)
		setInterval(() => {
			this.positionInsideZone = Random.direction(this.zone.center, 200)
		}, 1_000);

	}

	kill() {
		this.dead = true
		this.killed = new Killed(this)
		// SineWave.play()
		Audio.poop()
	}

	update() {
		if (this.killed) {
			return
		}

		const nearbyChicken = this.touchesAny(Registry.Chicken)
		if (nearbyChicken) {
			ForcePush(this).awayFrom(nearbyChicken, 2)
		}
		if (this.touches(this.zone)) {
			ForcePush(this).towards(this.positionInsideZone, 0.1)
		}
		else {
			ForcePush(this).towards(this.zone, 1)
		}

		const food = this.closestWithin(100, [])

		if (food) {
			ForcePush(this).towards(food)
		}
	}

	get alive() {
		return !this.killed
	}

	draw(draw, guiDraw) {
		if (this.killed) {
			this.killed.draw(draw, guiDraw)

			this.position.size(20, 20)
			draw.pink(this.position)
			this.velocity.reset()
		}
		else {
			this.sprite.draw(draw, guiDraw)
			// this.eatingSprite.draw(draw, guiDraw)
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
