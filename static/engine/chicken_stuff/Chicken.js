export class Chicken extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 1000)

		this.position.width = 60
		this.position.height = 60

		this.alive = true


		const zone = Random.choice(G.zones.regions)
		if (!this.touches(zone)) {
			this.x = zone.center.x
			this.y = zone.center.y
		}

		this.randomPositionInsideZone = Random.direction(zone.center, 200)

		this.localObjects = new LocalObjects([
			Init(this, {
				chickenSprites: new ChickenSprites(this),
			}),
			Update(() => {
				const nearbyChicken = this.touchesAny(Registry.Chicken)
				if (nearbyChicken) {
					this.enforceDistance(nearbyChicken)
				}
				else {
					ForcePush(this).towards(this.randomPositionInsideZone, 0.1)
				}
			}),
			OnTrue(() => this.touches(this.randomPositionInsideZone), () => {
				this.randomPositionInsideZone = Random.positionWithin(zone.center)
			}),
			OnTrue(() => this.touchesAny(Registry.ChickenFood), food => {
				this.chickenSprites.eat()
				food.removeFromLoop()
			}),
			D((draw, guiDraw) => {
				draw.orange(this.randomPositionInsideZone)
			}),
		])
	}

	kill() {
		this.chickenSprites.kill()
		this.alive = false
		Audio.poop()
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
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
