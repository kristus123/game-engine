export class SimpleMonster extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 10)

		this.position.width = 30*2
		this.position.height = 20*2

		this.hunger = 50

		this.localObjects = new LocalObjects([
			new HorizontalSprite(this.position, '/static/assets/blob_57x32.png'),
		])

		this.ranch = null
	}

	get happy() {
		for (const zone of G.zone.regions) {
			if (this.touches(zone)) {
				return true
			}
		}

		return false
	}

	update() {
		this.localObjects.update()

		this.hunger -= 0.1
		if (this.hunger < 0) {
			this.removeFromLoop()
		}

		if (Random.percentageChance(100)) {
			G.poop.add(new Poop(this.position.copy()))
		}

		const ranch = this.touchesAny(G.ranches)
		if (ranch) {
			ranch.add(this)
			this.ranch = ranch
		}

		if (Mouse.holdAndMove(this)) {

		}

		if (this.sleepyTime) {
			Move(this).towards(G.barn)
		}
		else {
			ForcePush(this).towards(Random.direction(this.position), 5)
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

	}
}
