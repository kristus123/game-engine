let  killAmount = 1

const quest = QuestList.add('Kill all the chickens')

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

		this.feathers = new LocalObjects()

		if (!this.touchesAny(G.zones.regions)) {
			this.zone = Random.choice(G.zones.regions)
		}

		this.positionInsideZone = new Position(0,0)
		setInterval(() => {
			this.positionInsideZone = Random.direction(this.zone.center, 200)
		}, 1_000);

	}

	kill() {
		if (killAmount > 10) {
			quest.completed()
		}
		this.dead = true
		this.killed = new Killed(this)
		// SineWave.play()
		setTimeout(() => {
			this.removeFromLoop()
		}, 3000)
		killAmount += 1
		Audio.poop()
	}

	update() {
		if (!this.killed) {
			const nearbyChicken = this.touchesAny(Registry.Chicken)
			if (nearbyChicken) {
				ForcePush(this).awayFrom(nearbyChicken, 2)
			}
			if (this.touches(this.zone)) {
				ForcePush(this).towards(this.positionInsideZone, 0.1)
			}
			else {
				Push(this).towards(this.zone, 1)
			}
			
		}
	}

	draw(draw, guiDraw) {
		if (Math.abs(this.velocity.x) || Math.abs(this.velocity.y)) {
			if (Random.integerBetween(-100, 10) > 0) {
				const f = new Feather(this.position)
				Push(f).towards(Random.direction(this.position), 10)
				this.feathers.add(f)
				setTimeout(() => {
					this.feathers.remove(f)
				}, 300);
			}
		}

		this.feathers.draw(draw, guiDraw)

		if (this.killed) {
			this.killed.draw(draw, guiDraw)
		}
		else {
			this.sprite.draw(draw, guiDraw)
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
