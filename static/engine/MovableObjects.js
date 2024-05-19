export class MovableObjects {
	constructor(movableBy, objects=[]) {

		this.key = new Key('e')

		this.holding = null
	}

	add(o) {
		this.objects.push(o)
	}

	update() {
		for (const o of this.objects) {
			if (Distance.within(50, o, this.movableBy) && this.key.down) {
				this.holding = o
			}
		}

		if (this.holding) {
			this.holding.x = this.movableBy.x
			this.holding.y = this.movableBy.y
		}
	}

	draw(draw, guiDraw) {
		if (this.holding) {
		}
		else {
			for (const o of this.objects) {
				if (Distance.within(50, o, this.movableBy)) {
					draw.new_text(o.position.offset(0, -50), 'Press E to pick up')
					break
				}
			}
		}
	}
}
