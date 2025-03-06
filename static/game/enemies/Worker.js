export class Worker extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 10)
		this.position.width = 10
		this.position.height = 10

		this.localObjects = new LocalObjects()
	}

	update() {
		this.localObjects.update()


		if (this.poop) {
			Move(this).towards(this.poop, 0.6)

			if (this.touches(this.poop)) {
				this.poop.remove()
				this.poop.worker = null
				this.poop = null
			}
		}
		else {
			G.poop.closestTo(this, poop => {
				if (!poop.worker) {
					this.poop = poop
					poop.worker = this
				}
			})
		}

	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		draw.orange(this.position)
	}
}
