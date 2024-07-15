export class MovableObjects {
	constructor(movableBy, objects=[]) {

		this.e = new Key('e')

		this.holding = null

		KeyDown('q', () => {
			ForcePush(this.holding).towards(Mouse.position, 100)
			this.holding = null
		})
	}

	add(o) {
		this.objects.push(o)
	}

	update() {
		if (this.holding) {
			this.holding.x = this.movableBy.x
			this.holding.y = this.movableBy.y
		}
		else {
			for (const o of this.objects) {
				if (Distance.within(100, o, this.movableBy) && this.e.down) {
					this.holding = o
				}
			}
		}
	}

	draw(draw, guiDraw) {
		if (this.holding) {
			draw.text(this.holding.position.offset(0, -50), 'Press Q to throw')
		}
		else {
			for (const o of this.objects) {
				if (Distance.within(100, o, this.movableBy)) {
					draw.text(o.position.offset(0, -50), 'Press E to pick up')
					break
				}
			}
		}
	}
}
