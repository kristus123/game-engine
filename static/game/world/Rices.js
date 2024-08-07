export class Rices {
	constructor(player, onFinish) {
		this.rices = Iterate(2000, () => new Square(Random.direction(this.player.position.offset(700, 0), 500), 1))

		this.ricePickedUp = 0
	}

	update() {
		for (const r of this.rices) {
			if (this.player.touches(r)) {
				this.ricePickedUp += 1
				List.remove(this.rices, r)
			}
		}

		if (this.ricePickedUp >= 5) {
			this.rices = []
			this.onFinish()
			this.removeFromLoop()
		}
	}

	draw(draw, guiDraw) {
		for (const r of this.rices) {
			r.draw(draw, guiDraw)
		}

	}
}
